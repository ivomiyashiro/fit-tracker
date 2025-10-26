import { and, eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { ReorderRoute } from "@/server/workout-exercises/endpoints/index.js";

import db from "@/server/db/index.js";
import { workoutExercise } from "@/server/db/schemas/index.js";

export const reorderWorkoutExercises: AppRouteHandler<ReorderRoute> = async (c) => {
  const { workoutExerciseId } = c.req.valid("param");
  const { exercises } = c.req.valid("json");
  const userId = c.get("auth").user.id;

  // Get the workout ID from the first workout exercise
  const firstExercise = await db.query.workoutExercise.findFirst({
    where: eq(workoutExercise.id, Number(workoutExerciseId)),
    with: {
      workout: true,
    },
  });

  if (!firstExercise) {
    return c.json(
      { message: "Workout exercise not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Verify workout belongs to user
  if (firstExercise.workout?.userId !== userId) {
    return c.json(
      { message: "Workout not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const workoutId = firstExercise.workoutId;

  // Update order for each exercise
  await Promise.all(
    exercises.map(exercise =>
      db
        .update(workoutExercise)
        .set({
          order: exercise.order,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(workoutExercise.id, exercise.id),
            eq(workoutExercise.workoutId, workoutId!),
          ),
        ),
    ),
  );

  return c.json(
    { message: "Workout exercises reordered successfully" },
    HttpStatusCodes.OK,
  );
};
