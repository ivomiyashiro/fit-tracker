import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/server/lib/constants.js";
import { updateWorkoutSchema } from "@/server/workouts/dtos/requests/index.js";
import { workoutResponseSchema } from "@/server/workouts/dtos/responses/index.js";

const tags = ["Workouts"];

export const updateWorkout = createRoute({
  path: "/workouts/{id}",
  method: "put",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      updateWorkoutSchema,
      "The workout updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      workoutResponseSchema,
      "The updated workout",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Workout not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateWorkoutSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type UpdateRoute = typeof updateWorkout;
