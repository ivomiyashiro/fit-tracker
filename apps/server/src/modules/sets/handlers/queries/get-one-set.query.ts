import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { SetResponse } from "@/server/sets/dtos/responses/index.js";
import type { GetOneSetRoute } from "@/server/sets/endpoints/index.js";

import db from "@/server/db/index.js";
import { workoutExerciseSet } from "@/server/db/schemas/index.js";

export const getOneSet: AppRouteHandler<GetOneSetRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const userId = c.get("auth").user.id;

  const set = await db.query.workoutExerciseSet.findFirst({
    where: eq(workoutExerciseSet.id, id),
    with: {
      workoutExercise: {
        with: {
          workout: true,
        },
      },
    },
  });

  if (!set || set.workoutExercise?.workout?.userId !== userId) {
    return c.json(
      { message: "Set not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const result: SetResponse = {
    id: set.id,
    workoutExerciseId: set.workoutExerciseId!,
    reps: set.reps,
    weight: set.weight,
    rir: set.rir,
    notes: set.notes,
    createdAt: set.createdAt.toISOString(),
    updatedAt: set.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.OK);
};
