import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

const tags = ["Workouts"];

export const bulkDeleteWorkout = createRoute({
  path: "/workouts",
  method: "delete",
  request: {
    body: jsonContentRequired(z.array(z.number()), "The workout ids to delete"),
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Workouts deleted",
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(z.array(z.number())),
      "Invalid workout ids error",
    ),
  },
});

export type DeleteRoute = typeof bulkDeleteWorkout;
