import { and, eq, inArray } from "drizzle-orm";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { DeleteRoute } from "@/server/workouts/endpoints/index.js";

import db from "@/server/db/index.js";
import { workout, workoutExercise, workoutExerciseSet } from "@/server/db/schemas/index.js";

export const bulkDeleteWorkout: AppRouteHandler<DeleteRoute> = async (c) => {
  const workoutIds = c.req.valid("json");
  const userId = c.get("auth").user.id;

  // Check if all workouts exist and belong to user
  const existingWorkouts = await db.query.workout.findMany({
    where: and(inArray(workout.id, workoutIds), eq(workout.userId, userId)),
  });

  if (existingWorkouts.length !== workoutIds.length) {
    return c.json({ message: "One or more workouts not found" }, 404);
  }

  // Get all workout exercise IDs to delete their sets first
  const workoutExerciseIds = await db.query.workoutExercise.findMany({
    where: inArray(workoutExercise.workoutId, workoutIds),
    columns: { id: true },
  });

  const exerciseIds = workoutExerciseIds.map(we => we.id);

  // Delete in correct order to handle foreign key constraints:
  // 1. Delete workout exercise sets first (depends on workout_exercise)
  if (exerciseIds.length > 0) {
    await db.delete(workoutExerciseSet)
      .where(inArray(workoutExerciseSet.workoutExerciseId, exerciseIds));
  }

  // 2. Delete workout exercises (depends on workout)
  await db.delete(workoutExercise)
    .where(inArray(workoutExercise.workoutId, workoutIds));

  // 3. Delete the workouts
  await db.delete(workout)
    .where(inArray(workout.id, workoutIds));

  return c.json(null);
};
