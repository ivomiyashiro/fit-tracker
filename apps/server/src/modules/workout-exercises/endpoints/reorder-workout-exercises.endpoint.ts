import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/server/lib/constants.js";

const tags = ["Workout Exercises"];

export const reorderWorkoutExercises = createRoute({
  path: "/workout-exercises/:workoutExerciseId/reorder",
  method: "patch",
  request: {
    params: z.object({
      workoutExerciseId: z.string().openapi({
        param: {
          name: "workoutExerciseId",
          in: "path",
        },
        example: "1",
      }),
    }),
    body: jsonContent(
      z.object({
        exercises: z.array(
          z.object({
            id: z.number(),
            order: z.number(),
          }),
        ),
      }),
      "Reorder workout exercises",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      createMessageObjectSchema("Workout exercises reordered successfully"),
      "Workout exercises reordered successfully",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Workout not found",
    ),
  },
});

export type ReorderRoute = typeof reorderWorkoutExercises;
