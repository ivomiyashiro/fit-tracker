import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/server/lib/constants.js";
import { createWorkoutSessionSchema } from "@/server/workout-sessions/dtos/requests/index.js";
import { workoutSessionResponseSchema } from "@/server/workout-sessions/dtos/responses/index.js";

const tags = ["Workout Sessions"];

export const createWorkoutSession = createRoute({
  path: "/workout-sessions",
  method: "post",
  request: {
    body: jsonContentRequired(
      createWorkoutSessionSchema,
      "The workout session to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      workoutSessionResponseSchema,
      "The created workout session",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Workout not found",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      notFoundSchema,
      "Active workout session already exists",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createWorkoutSessionSchema),
      "The validation error(s)",
    ),
  },
});

export type CreateWorkoutSessionRoute = typeof createWorkoutSession;
