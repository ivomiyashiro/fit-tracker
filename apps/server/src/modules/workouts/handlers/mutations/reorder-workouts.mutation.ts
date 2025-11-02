import { and, eq, inArray } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { ReorderWorkoutsRoute } from "@/server/workouts/endpoints/reorder-workouts.endpoint.js";

import db from "@/server/db/index.js";
import { workout } from "@/server/db/schemas/index.js";

export const reorderWorkouts: AppRouteHandler<ReorderWorkoutsRoute> = async (c) => {
  const { workouts } = c.req.valid("json");
  const userId = c.get("auth").user.id;

  const workoutIds = workouts.map(w => w.id);

  const userWorkouts = await db.query.workout.findMany({
    where: and(
      inArray(workout.id, workoutIds),
      eq(workout.userId, userId),
    ),
  });

  if (userWorkouts.length !== workoutIds.length) {
    return c.json(
      { message: "One or more workouts not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  await Promise.all(
    workouts.map(w =>
      db
        .update(workout)
        .set({
          order: w.order,
          updatedAt: new Date(),
        })
        .where(eq(workout.id, w.id)),
    ),
  );

  return c.json(
    { message: "Workouts reordered successfully" },
    HttpStatusCodes.OK,
  );
};
