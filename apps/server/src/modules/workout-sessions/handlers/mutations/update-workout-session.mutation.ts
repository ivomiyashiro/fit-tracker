import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/server/lib/types.js";
import type { UpdateWorkoutSessionRoute } from "@/server/workout-sessions/endpoints/update-workout-session.endpoint.js";

import db from "@/server/db/index.js";
import { workoutSession } from "@/server/db/schemas/index.js";

export const updateWorkoutSession: AppRouteHandler<UpdateWorkoutSessionRoute> = async (c) => {
  const { id } = c.req.valid("param");
  const body = c.req.valid("json");
  const userId = c.get("auth").user.id;

  const session = await db.query.workoutSession.findFirst({
    where: eq(workoutSession.id, id),
  });

  if (!session) {
    return c.json(
      { message: "Workout session not found" },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  if (session.userId !== userId) {
    return c.json(
      { message: "Unauthorized" },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const updateData: Record<string, unknown> = {
    updatedAt: new Date(),
  };

  if (body.completedAt !== undefined) {
    updateData.completedAt = new Date(body.completedAt);
  }

  if (body.duration !== undefined) {
    updateData.duration = body.duration;
  }

  if (body.notes !== undefined) {
    updateData.notes = body.notes;
  }

  const [updatedSession] = await db
    .update(workoutSession)
    .set(updateData)
    .where(eq(workoutSession.id, id))
    .returning();

  const response = {
    id: updatedSession!.id,
    workoutId: updatedSession!.workoutId,
    completedAt: updatedSession!.completedAt?.toISOString() ?? "",
    duration: updatedSession!.duration,
    notes: updatedSession!.notes,
    createdAt: updatedSession!.createdAt.toISOString(),
    updatedAt: updatedSession!.updatedAt.toISOString(),
  };

  return c.json(response, HttpStatusCodes.OK);
};
