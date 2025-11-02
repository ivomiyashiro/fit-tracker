import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { notFoundSchema, unauthorizedSchema } from "@/server/lib/constants.js";
import { workoutSessionDetailSchema } from "@/server/workout-sessions/dtos/responses/index.js";

const tags = ["Workout Sessions"];

export const getWorkoutSession = createRoute({
  path: "/workout-sessions/{id}",
  method: "get",
  tags,
  request: {
    params: z.object({
      id: z.string().transform(Number),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      workoutSessionDetailSchema,
      "Workout session with detailed workout information",
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

export type GetWorkoutSessionRoute = typeof getWorkoutSession;
