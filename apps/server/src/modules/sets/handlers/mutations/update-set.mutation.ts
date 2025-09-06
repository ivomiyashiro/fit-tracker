import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types";
import type { SetResponse } from "@/server/sets/dtos/responses";
import type { UpdateSetRoute } from "@/server/sets/endpoints";

import db from "@/server/db/index.js";
import { workoutExerciseSet } from "@/server/db/schemas/index.js";

export const updateSet: AppRouteHandler<UpdateSetRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const updateData = c.req.valid("json");

  const [updatedSet] = await db.update(workoutExerciseSet)
    .set({
      ...updateData,
      updatedAt: new Date(),
    })
    .where(eq(workoutExerciseSet.id, id))
    .returning();

  const result: SetResponse = {
    id: updatedSet.id,
    workoutExerciseId: updatedSet.workoutExerciseId!,
    reps: updatedSet.reps,
    weight: updatedSet.weight,
    rir: updatedSet.rir,
    notes: updatedSet.notes,
    createdAt: updatedSet.createdAt.toISOString(),
    updatedAt: updatedSet.updatedAt.toISOString(),
  };

  return c.json(result, HttpStatusCodes.OK);
};
