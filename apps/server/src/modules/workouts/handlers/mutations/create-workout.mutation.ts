import { inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { Exercise, ExerciseMuscleGroup, MuscleGroup, WorkoutExercise } from "@/server/db/schemas";
import type { AppRouteHandler } from "@/server/lib/types";
import type { WorkoutResponse } from "@/server/workouts/dtos/responses";
import type { CreateRoute } from "@/server/workouts/endpoints";

import db from "@/server/db";
import { exercise, exerciseMuscleGroup, muscleGroup, workout, workoutExercise } from "@/server/db/schemas";

export const createWorkout: AppRouteHandler<CreateRoute> = async (c) => {
  const { name, exerciseIds } = c.req.valid("json");
  const userId = c.get("auth").user.id;

  let newWorkoutExercises: WorkoutExercise[] = [];
  let exercises: Exercise[] = [];
  let muscleGroups: MuscleGroup[] = [];
  let exerciseMuscleGroups: ExerciseMuscleGroup[] = [];

  const [newWorkout] = await db.insert(workout).values({
    name,
    userId,
  }).returning();

  if (exerciseIds) {
    newWorkoutExercises = await db.insert(workoutExercise).values(exerciseIds.map(id => ({
      workoutId: newWorkout.id,
      exerciseId: id,
    }))).returning();

    exercises = await db.query.exercise.findMany({
      where: inArray(exercise.id, exerciseIds),
    });

    // Get muscle groups for the exercises through the junction table
    exerciseMuscleGroups = await db.query.exerciseMuscleGroup.findMany({
      where: inArray(exerciseMuscleGroup.exerciseId, exerciseIds),
    });

    const muscleGroupIds = exerciseMuscleGroups
      .map(rel => rel.muscleGroupId)
      .filter((id): id is number => id !== null);

    muscleGroups = await db.query.muscleGroup.findMany({
      where: inArray(muscleGroup.id, muscleGroupIds),
    });
  }

  // Create a map of exercise ID to muscle group names for efficient lookup
  const exerciseMuscleGroupMap = new Map<number, string[]>();

  if (exerciseIds) {
    // Group muscle group IDs by exercise ID
    const exerciseToMuscleGroups = new Map<number, number[]>();
    exerciseMuscleGroups.forEach((rel) => {
      if (rel.exerciseId !== null && rel.muscleGroupId !== null) {
        const existing = exerciseToMuscleGroups.get(rel.exerciseId) || [];
        existing.push(rel.muscleGroupId);
        exerciseToMuscleGroups.set(rel.exerciseId, existing);
      }
    });

    // Create muscle group name lookup
    const muscleGroupMap = new Map(muscleGroups.map(mg => [mg.id, mg.name]));

    // Build the final map
    exercises.forEach((ex) => {
      const muscleGroupIds = exerciseToMuscleGroups.get(ex.id) || [];
      const muscleGroupNames = muscleGroupIds
        .map(id => muscleGroupMap.get(id))
        .filter((name): name is string => name !== undefined);
      exerciseMuscleGroupMap.set(ex.id, muscleGroupNames);
    });
  }

  const result: WorkoutResponse = {
    id: newWorkout.id,
    name: newWorkout.name,
    workoutExercises: newWorkoutExercises.map(we => ({
      id: we.id,
      exercises: exercises.map(e => ({
        id: e.id,
        name: e.name,
        muscleGroups: exerciseMuscleGroupMap.get(e.id) || [],
      })),
      createdAt: we.createdAt.toISOString(),
      updatedAt: we.updatedAt.toISOString(),
    })),
    createdAt: newWorkout.createdAt.toISOString(),
    updatedAt: newWorkout.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.CREATED);
};
