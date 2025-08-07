import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types";
import type { DeleteRoute } from "@/server/workout-exercises/endpoints";

import db from "@/server/db";
import { workoutExercise } from "@/server/db/schemas";

export const deleteWorkoutExercise: AppRouteHandler<DeleteRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const userId = c.get("auth").user.id;

  // Check if workout exercise exists and belongs to user
  const existingWorkoutExercise = await db.query.workoutExercise.findFirst({
    where: eq(workoutExercise.id, id),
    with: {
      workout: true,
    },
  });

  if (!existingWorkoutExercise) {
    return c.json(
      { message: "Workout exercise not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Check if the workout belongs to the user
  if (existingWorkoutExercise.workout?.userId !== userId) {
    return c.json(
      { message: "Workout exercise not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Delete the workout exercise
  await db.delete(workoutExercise).where(eq(workoutExercise.id, id));

  return c.json(null);
};
