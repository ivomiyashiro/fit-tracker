import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { badRequestSchema, notFoundSchema, unauthorizedSchema } from "@/server/lib/constants.js";
import { workoutSessionSummarySchema } from "@/server/workout-sessions/dtos/responses/index.js";

const tags = ["Workout Sessions"];

export const getWorkoutSessionSummary = createRoute({
  path: "/workout-sessions/{id}/summary",
  method: "get",
  tags,
  request: {
    params: z.object({
      id: z.string().transform(Number),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      workoutSessionSummarySchema,
      "Workout session summary with statistics",
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      badRequestSchema,
      "Workout session not yet completed",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Workout session not found",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized to access this session",
    ),
  },
});

export type GetWorkoutSessionSummaryRoute = typeof getWorkoutSessionSummary;
