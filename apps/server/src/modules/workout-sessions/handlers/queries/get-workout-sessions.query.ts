import { and, eq, gte, lte } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { GetWorkoutSessionsRoute } from "@/server/workout-sessions/endpoints/get-workout-sessions.endpoint.js";

import db from "@/server/db/index.js";
import { workoutSession } from "@/server/db/schemas/index.js";

export const getWorkoutSessions: AppRouteHandler<GetWorkoutSessionsRoute> = async (c) => {
  const userId = c.get("auth").user.id;
  const { year, month } = c.req.valid("query");

  let whereCondition = eq(workoutSession.userId, userId);

  if (year !== undefined && month !== undefined) {
    // Get sessions for the specific month
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    whereCondition = and(
      whereCondition,
      gte(workoutSession.completedAt, startDate),
      lte(workoutSession.completedAt, endDate),
    ) as any;
  }

  const sessions = await db.query.workoutSession.findMany({
    where: whereCondition,
    orderBy: (session, { desc }) => [desc(session.completedAt)],
  });

  // Map database rows to response schema
  const response = sessions.map(session => ({
    id: session.id,
    workoutId: session.workoutId,
    completedAt: session.completedAt?.toISOString() ?? null,
    duration: session.duration,
    notes: session.notes,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  }));

  return c.json(response, HttpStatusCodes.OK);
};
