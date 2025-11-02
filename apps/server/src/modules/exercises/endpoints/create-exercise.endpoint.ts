import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";

import { createExerciseSchema } from "@/server/modules/exercises/dtos/requests/index.js";
import { singleExerciseResponseSchema } from "@/server/modules/exercises/dtos/responses/index.js";

const tags = ["Exercises"];

export const createExercise = createRoute({
  path: "/exercises",
  method: "post",
  request: {
    body: jsonContentRequired(
      createExerciseSchema,
      "The exercise to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      singleExerciseResponseSchema,
      "The created exercise",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(
      createMessageObjectSchema("An exercise with this name already exists"),
      "Exercise with this name already exists",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createExerciseSchema),
      "The validation error(s)",
    ),
  },
});

export type CreateRoute = typeof createExercise;
