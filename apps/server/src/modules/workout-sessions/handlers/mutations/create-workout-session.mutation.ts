import { and, eq, isNull } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { CreateWorkoutSessionRoute } from "@/server/workout-sessions/endpoints/create-workout-session.endpoint.js";

import db from "@/server/db/index.js";
import { workout, workoutSession } from "@/server/db/schemas/index.js";

export const createWorkoutSession: AppRouteHandler<CreateWorkoutSessionRoute> = async (c) => {
  const { workoutId, completedAt, duration, notes } = c.req.valid("json");
  const userId = c.get("auth").user.id;

  // Check if there's an active session
  const activeSession = await db.query.workoutSession.findFirst({
    where: and(
      eq(workoutSession.userId, userId),
      isNull(workoutSession.completedAt),
    ),
  });

  if (activeSession) {
    return c.json(
      { message: "You have an active workout session. Please complete it before starting a new one." },
      HttpStatusCodes.CONFLICT,
    );
  }

  const userWorkout = await db.query.workout.findFirst({
    where: eq(workout.id, workoutId),
  });

  if (!userWorkout || userWorkout.userId !== userId) {
    return c.json(
      { message: "Workout not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  const [newSession] = await db.insert(workoutSession).values({
    workoutId,
    userId,
    completedAt: completedAt ? new Date(completedAt) : null,
    duration,
    notes,
  }).returning();

  return c.json(
    {
      id: newSession.id,
      workoutId: newSession.workoutId,
      completedAt: newSession.completedAt?.toISOString() ?? null,
      duration: newSession.duration,
      notes: newSession.notes,
      createdAt: newSession.createdAt.toISOString(),
      updatedAt: newSession.updatedAt.toISOString(),
    },
    HttpStatusCodes.CREATED,
  );
};
