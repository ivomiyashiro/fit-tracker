import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

const tags = ["Exercises"];

export const bulkDeleteExercise = createRoute({
  path: "/exercises",
  method: "delete",
  request: {
    body: jsonContentRequired(z.array(z.number()), "The exercise ids to delete"),
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Exercises deleted",
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.array(z.number())),
      "Invalid exercise ids error",
    ),
  },
});

export type DeleteRoute = typeof bulkDeleteExercise;
