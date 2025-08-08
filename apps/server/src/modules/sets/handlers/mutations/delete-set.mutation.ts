import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types";
import type { DeleteSetRoute } from "@/server/sets/endpoints";

import db from "@/server/db";
import { workout, workoutExerciseSet } from "@/server/db/schemas";

export const deleteSet: AppRouteHandler<DeleteSetRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const userId = c.get("auth").user.id;

  const userWorkout = await db.query.workout.findFirst({
    where: eq(workout.userId, userId),
    with: {
      workoutExercises: {
        with: {
          workoutExerciseSets: {
            where: eq(workoutExerciseSet.id, id),
          },
        },
      },
    },
  });

  if (!userWorkout || !userWorkout.workoutExercises.some(we => we.workoutExerciseSets.some(wes => wes.id === id))) {
    return c.json(
      { message: "Workout exercise not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  await db.delete(workoutExerciseSet)
    .where(eq(workoutExerciseSet.id, id));

  return c.json(null);
};
