import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, createMessageObjectSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/server/lib/constants.js";
import { reorderWorkoutsSchema } from "@/server/workouts/dtos/requests/index.js";

const tags = ["Workouts"];

export const reorderWorkouts = createRoute({
  path: "/workouts/reorder",
  method: "patch",
  request: {
    body: jsonContentRequired(
      reorderWorkoutsSchema,
      "The workouts to reorder",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Workouts reordered successfully"),
      "Workouts reordered successfully",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "One or more workouts not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(reorderWorkoutsSchema),
      "The validation error(s)",
    ),
  },
});

export type ReorderWorkoutsRoute = typeof reorderWorkouts;
