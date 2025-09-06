import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types";
import type { SetResponse } from "@/server/sets/dtos/responses";
import type { CreateSetRoute } from "@/server/sets/endpoints";

import db from "@/server/db/index.js";
import { workoutExercise, workoutExerciseSet } from "@/server/db/schemas/index.js";

export const createSet: AppRouteHandler<CreateSetRoute> = async (c) => {
  const { workoutExerciseId, reps, weight, rir, notes } = c.req.valid("json");
  const userId = c.get("auth").user.id;

  const userWorkoutExercise = await db.query.workoutExercise.findFirst({
    where: eq(workoutExercise.id, workoutExerciseId),
    with: {
      workout: true,
    },
  });

  if (!userWorkoutExercise || userWorkoutExercise.workout?.userId !== userId) {
    return c.json(
      { message: "Workout exercise not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [newSet] = await db.insert(workoutExerciseSet).values({
    workoutExerciseId,
    reps,
    weight,
    rir,
    notes,
  }).returning();

  const result: SetResponse = {
    id: newSet.id,
    workoutExerciseId: newSet.workoutExerciseId!,
    reps: newSet.reps,
    weight: newSet.weight,
    rir: newSet.rir,
    notes: newSet.notes,
    createdAt: newSet.createdAt.toISOString(),
    updatedAt: newSet.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.CREATED);
};
