import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types";
import type { DeleteRoute } from "@/server/workouts/endpoints";

import db from "@/server/db";
import { workout, workoutExercise } from "@/server/db/schemas";

export const deleteWorkout: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const userId = c.get("auth").user.id;

  // Check if workout exists and belongs to user
  const existingWorkout = await db.query.workout.findFirst({
    where: eq(workout.id, id),
  });

  if (!existingWorkout || existingWorkout.userId !== userId) {
    return c.json({ message: "Workout not found" }, HttpStatusCodes.NOT_FOUND);
  }

  // Delete workout exercises first (due to foreign key constraints)
  await db.delete(workoutExercise)
    .where(eq(workoutExercise.workoutId, id));

  // Delete the workout
  await db.delete(workout)
    .where(eq(workout.id, id));

  return c.json(null);
};
