import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/server/lib/constants.js";

const tags = ["Workout Exercises"];

export const deleteWorkoutExercise = createRoute({
  path: "/workout-exercises",
  method: "delete",
  request: {
    body: jsonContent(z.array(z.number()), "Workout exercise ids"),
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Workout exercise deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Workout exercise not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error",
    ),
  },
});

export type DeleteRoute = typeof deleteWorkoutExercise;
