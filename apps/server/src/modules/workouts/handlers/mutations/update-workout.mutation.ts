import { eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { WorkoutExerciseWithExercise } from "@/server/modules/workouts/utils/index.js";
import type { WorkoutResponse } from "@/server/workouts/dtos/responses/index.js";
import type { UpdateRoute } from "@/server/workouts/endpoints/index.js";

import db from "@/server/db/index.js";
import { workout, workoutExercise, workoutExerciseSet } from "@/server/db/schemas/index.js";
import { getExercisesWithMuscleGroups, mapWorkoutExercisesToResponse } from "@/server/modules/workouts/utils/index.js";

export const updateWorkout: AppRouteHandler<UpdateRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const { name, exerciseIds = [] } = c.req.valid("json");
  const userId = c.get("auth").user.id;

  const existingWorkout = await db.query.workout.findFirst({
    where: eq(workout.id, id),
  });

  if (!existingWorkout || existingWorkout.userId !== userId) {
    return c.json({ message: "Workout not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Get existing workout exercises
  const existingWorkoutExercises = await db.query.workoutExercise.findMany({
    where: eq(workoutExercise.workoutId, id),
  });

  const existingExerciseIds = existingWorkoutExercises.map(we => we.exerciseId);
  const newExerciseIds = exerciseIds;

  // Find exercises to remove (exist currently but not in new list)
  const exercisesToRemove = existingWorkoutExercises.filter(
    we => !newExerciseIds.includes(we.exerciseId),
  );

  // Find exercises to add (in new list but don't exist currently)
  const exercisesToAdd = newExerciseIds.filter(
    (exerciseId: number) => !existingExerciseIds.includes(exerciseId),
  );

  // Delete sets for exercises that will be removed
  if (exercisesToRemove.length > 0) {
    const workoutExerciseIdsToRemove = exercisesToRemove.map(we => we.id);
    await db.delete(workoutExerciseSet)
      .where(inArray(workoutExerciseSet.workoutExerciseId, workoutExerciseIdsToRemove));
  }

  // Update workout and handle exercise changes
  const [updatedWorkout] = await db.update(workout)
    .set({
      name,
      updatedAt: new Date(),
    })
    .where(eq(workout.id, id))
    .returning();

  // Remove workout exercises that are no longer needed
  if (exercisesToRemove.length > 0) {
    await db.delete(workoutExercise)
      .where(inArray(workoutExercise.id, exercisesToRemove.map(we => we.id)));
  }

  // Add new workout exercises
  if (exercisesToAdd.length > 0) {
    await db.insert(workoutExercise).values(
      exercisesToAdd.map((exerciseId: number) => ({
        workoutId: id,
        exerciseId,
      })),
    ).returning();
  }

  // Get all current workout exercises (existing + newly added)
  const allCurrentWorkoutExercises = await db.query.workoutExercise.findMany({
    where: eq(workoutExercise.workoutId, id),
  });

  let workoutExercisesResponse: WorkoutExerciseWithExercise[] = [];

  if (allCurrentWorkoutExercises.length > 0) {
    const currentExerciseIds = allCurrentWorkoutExercises
      .map(we => we.exerciseId)
      .filter((id): id is number => id !== null);
    const exercisesWithMuscleGroups = await getExercisesWithMuscleGroups(currentExerciseIds);
    workoutExercisesResponse = mapWorkoutExercisesToResponse(allCurrentWorkoutExercises, exercisesWithMuscleGroups);
  }

  const result: WorkoutResponse = {
    id: updatedWorkout.id,
    name: updatedWorkout.name,
    order: updatedWorkout.order,
    workoutExercises: workoutExercisesResponse,
    createdAt: updatedWorkout.createdAt.toISOString(),
    updatedAt: updatedWorkout.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.OK);
};
