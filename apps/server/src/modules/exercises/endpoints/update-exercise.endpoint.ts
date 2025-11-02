import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/server/lib/constants.js";
import { updateExerciseSchema } from "@/server/modules/exercises/dtos/requests/index.js";
import { singleExerciseResponseSchema } from "@/server/modules/exercises/dtos/responses/index.js";

const tags = ["Exercises"];

export const updateExercise = createRoute({
  path: "/exercises/{id}",
  method: "put",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      updateExerciseSchema,
      "The exercise updates",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      singleExerciseResponseSchema,
      "The updated exercise",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Exercise not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateExerciseSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type UpdateRoute = typeof updateExercise;
