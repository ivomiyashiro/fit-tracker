import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types";
import type { DeleteSetRoute } from "@/server/sets/endpoints";

import db from "@/server/db/index.js";
import { workoutExerciseSet } from "@/server/db/schemas/index.js";

export const deleteSet: AppRouteHandler<DeleteSetRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const userId = c.get("auth").user.id;

  const existingSet = await db.query.workoutExerciseSet.findFirst({
    where: eq(workoutExerciseSet.id, id),
    with: {
      workoutExercise: {
        with: {
          workout: true,
        },
      },
    },
  });

  if (!existingSet || existingSet.workoutExercise?.workout?.userId !== userId) {
    return c.json(
      { message: "Set not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  await db
    .delete(workoutExerciseSet)
    .where(eq(workoutExerciseSet.id, id));

  return c.json(null);
};
