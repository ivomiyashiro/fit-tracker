import { eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types";
import type { WorkoutResponse } from "@/server/workouts/dtos/responses";
import type { UpdateRoute } from "@/server/workouts/endpoints";

import db from "@/server/db";
import { exercise, exerciseMuscleGroup, muscleGroup, workout, workoutExercise } from "@/server/db/schemas";

export const updateWorkout: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const { name, exerciseIds } = c.req.valid("json");
  const userId = c.get("auth").user.id;

  // Check if workout exists and belongs to user
  const existingWorkout = await db.query.workout.findFirst({
    where: eq(workout.id, id),
  });

  if (!existingWorkout || existingWorkout.userId !== userId) {
    return c.json({ message: "Workout not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Update workout name
  const [updatedWorkout] = await db.update(workout)
    .set({ name })
    .where(eq(workout.id, id))
    .returning();

  // Delete existing workout exercises
  await db.delete(workoutExercise)
    .where(eq(workoutExercise.workoutId, id));

  let newWorkoutExercises: typeof workoutExercise.$inferSelect[] = [];
  let exercises: typeof exercise.$inferSelect[] = [];
  let muscleGroups: typeof muscleGroup.$inferSelect[] = [];
  let exerciseMuscleGroups: typeof exerciseMuscleGroup.$inferSelect[] = [];

  if (exerciseIds) {
    // Insert new workout exercises
    newWorkoutExercises = await db.insert(workoutExercise).values(
      exerciseIds.map(exerciseId => ({
        workoutId: id,
        exerciseId,
      })),
    ).returning();

    // Get exercises
    exercises = await db.query.exercise.findMany({
      where: inArray(exercise.id, exerciseIds),
    });

    // Get exercise-muscle group relations
    exerciseMuscleGroups = await db.query.exerciseMuscleGroup.findMany({
      where: inArray(exerciseMuscleGroup.exerciseId, exerciseIds),
    });

    // Get muscle group IDs
    const muscleGroupIds = exerciseMuscleGroups
      .map(rel => rel.muscleGroupId)
      .filter((id): id is number => id !== null);

    // Get muscle groups
    muscleGroups = await db.query.muscleGroup.findMany({
      where: inArray(muscleGroup.id, muscleGroupIds),
    });
  }

  // Create muscle group name lookup
  const muscleGroupMap = new Map(muscleGroups.map(mg => [mg.id, mg.name]));

  // Group muscle group IDs by exercise ID
  const exerciseToMuscleGroups = new Map<number, number[]>();
  exerciseMuscleGroups.forEach((rel) => {
    if (rel.exerciseId !== null && rel.muscleGroupId !== null) {
      const existing = exerciseToMuscleGroups.get(rel.exerciseId) || [];
      existing.push(rel.muscleGroupId);
      exerciseToMuscleGroups.set(rel.exerciseId, existing);
    }
  });

  // Create exercise to muscle groups map
  const exerciseMuscleGroupMap = new Map<number, string[]>();
  exercises.forEach((ex) => {
    const muscleGroupIds = exerciseToMuscleGroups.get(ex.id) || [];
    const muscleGroupNames = muscleGroupIds
      .map(id => muscleGroupMap.get(id))
      .filter((name): name is string => name !== undefined);
    exerciseMuscleGroupMap.set(ex.id, muscleGroupNames);
  });

  const result: WorkoutResponse = {
    id: updatedWorkout.id,
    name: updatedWorkout.name,
    workoutExercises: newWorkoutExercises.map(we => ({
      id: we.id,
      exercises: exercises.filter(e => e.id === we.exerciseId).map(e => ({
        id: e.id,
        name: e.name,
        muscleGroups: exerciseMuscleGroupMap.get(e.id) || [],
      })),
      createdAt: we.createdAt.toISOString(),
      updatedAt: we.updatedAt.toISOString(),
    })),
    createdAt: updatedWorkout.createdAt.toISOString(),
    updatedAt: updatedWorkout.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.OK);
};
