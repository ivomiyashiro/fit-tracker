import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import { exerciseResponseSchema } from "@/server/exercises/dtos/responses/index.js";

const tags = ["Exercises"];

export const getPaginatedExercises = createRoute({
  path: "/exercises",
  method: "get",
  request: {
    query: z.object({
      page: z.string().transform(val => Number.parseInt(val, 10)).optional(),
      limit: z.string().transform(val => Number.parseInt(val, 10)).optional(),
      search: z.string().optional(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(exerciseResponseSchema, "The paginated exercises"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "Not found",
    ),
  },
});

export type GetPaginatedExercisesRoute = typeof getPaginatedExercises;
