import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { workoutSessionResponseSchema } from "@/server/workout-sessions/dtos/responses/index.js";

const tags = ["Workout Sessions"];

export const getWorkoutSessions = createRoute({
  path: "/workout-sessions",
  method: "get",
  tags,
  request: {
    query: z.object({
      year: z.string().optional().transform(val => val ? Number.parseInt(val) : undefined),
      month: z.string().optional().transform(val => val ? Number.parseInt(val) : undefined),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(workoutSessionResponseSchema),
      "Array of workout sessions",
    ),
  },
});

export type GetWorkoutSessionsRoute = typeof getWorkoutSessions;
