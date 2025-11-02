import { inArray } from "drizzle-orm";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { DeleteRoute } from "@/server/modules/exercises/endpoints/index.js";

import db from "@/server/db/index.js";
import { exercise, exerciseMuscleGroup, workoutExercise, workoutExerciseSet } from "@/server/db/schemas/index.js";

export const bulkDeleteExercise: AppRouteHandler<DeleteRoute> = async (c) => {
  const exerciseIds = c.req.valid("json");

  // Check if all exercises exist
  const existingExercises = await db.query.exercise.findMany({
    where: inArray(exercise.id, exerciseIds),
  });

  if (existingExercises.length !== exerciseIds.length) {
    return c.json({ message: "One or more exercises not found" }, 404);
  }

  // Get all workout exercise IDs to delete their sets first
  const workoutExercises = await db.query.workoutExercise.findMany({
    where: inArray(workoutExercise.exerciseId, exerciseIds),
    columns: { id: true },
  });

  const workoutExerciseIds = workoutExercises.map(we => we.id);

  // Delete in correct order to handle foreign key constraints:
  // 1. Delete workout exercise sets first (depends on workout_exercise)
  if (workoutExerciseIds.length > 0) {
    await db.delete(workoutExerciseSet)
      .where(inArray(workoutExerciseSet.workoutExerciseId, workoutExerciseIds));
  }

  // 2. Delete workout exercises (depends on exercise)
  if (workoutExerciseIds.length > 0) {
    await db.delete(workoutExercise)
      .where(inArray(workoutExercise.exerciseId, exerciseIds));
  }

  // 3. Delete exercise-muscle group relationships (depends on exercise)
  await db.delete(exerciseMuscleGroup)
    .where(inArray(exerciseMuscleGroup.exerciseId, exerciseIds));

  // 4. Delete the exercises
  await db.delete(exercise)
    .where(inArray(exercise.id, exerciseIds));

  return c.json(null);
};
