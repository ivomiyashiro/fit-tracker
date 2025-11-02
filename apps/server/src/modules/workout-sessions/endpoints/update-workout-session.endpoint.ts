import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { notFoundSchema, unauthorizedSchema } from "@/server/lib/constants.js";
import { updateWorkoutSessionSchema } from "@/server/workout-sessions/dtos/requests/index.js";
import { workoutSessionResponseSchema } from "@/server/workout-sessions/dtos/responses/index.js";

const tags = ["Workout Sessions"];

export const updateWorkoutSession = createRoute({
  path: "/workout-sessions/{id}",
  method: "patch",
  tags,
  request: {
    params: z.object({
      id: z.string().transform(Number),
    }),
    body: jsonContent(updateWorkoutSessionSchema, "Workout session data to update"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      workoutSessionResponseSchema,
      "Updated workout session",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Workout session not found",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      unauthorizedSchema,
      "Unauthorized to update this session",
    ),
  },
});

export type UpdateWorkoutSessionRoute = typeof updateWorkoutSession;
