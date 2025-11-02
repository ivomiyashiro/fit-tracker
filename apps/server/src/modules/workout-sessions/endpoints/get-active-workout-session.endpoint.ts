import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { notFoundSchema } from "@/server/lib/constants.js";
import { workoutSessionDetailSchema } from "@/server/workout-sessions/dtos/responses/index.js";

const tags = ["Workout Sessions"];

export const getActiveWorkoutSession = createRoute({
  path: "/workout-sessions/active",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      workoutSessionDetailSchema,
      "The active workout session",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "No active workout session found",
    ),
  },
});

export type GetActiveWorkoutSessionRoute = typeof getActiveWorkoutSession;
