import { inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { DeleteRoute } from "@/server/workout-exercises/endpoints/index.js";

import db from "@/server/db/index.js";
import { workoutExercise } from "@/server/db/schemas/index.js";

export const deleteWorkoutExercise: AppRouteHandler<DeleteRoute> = async (c) => {
  const workoutExerciseIds = c.req.valid("json");
  const userId = c.get("auth").user.id;

  // Check if workout exercise exists and belongs to user
  const existingWorkoutExercise = await db.query.workoutExercise.findFirst({
    where: inArray(workoutExercise.id, workoutExerciseIds),
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
  await db.delete(workoutExercise).where(inArray(workoutExercise.id, workoutExerciseIds));

  return c.json(null);
};
