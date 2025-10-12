import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";

import { createWorkoutSchema } from "@/server/workouts/dtos/requests/index.js";
import { workoutResponseSchema } from "@/server/workouts/dtos/responses/index.js";

const tags = ["Workouts"];

export const createWorkout = createRoute({
  path: "/workouts",
  method: "post",
  request: {
    body: jsonContentRequired(
      createWorkoutSchema,
      "The workout to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      workoutResponseSchema,
      "The created workout",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      createMessageObjectSchema("A workout with this name already exists"),
      "Workout with this name already exists",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createWorkoutSchema),
      "The validation error(s)",
    ),
  },
});

export type CreateRoute = typeof createWorkout;
