import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import { setResponseSchema } from "@/server/sets/dtos/responses";

const tags = ["Sets"];

export const getPaginatedSets = createRoute({
  path: "/sets",
  method: "get",
  request: {
    query: z.object({
      page: z.string().transform(val => Number.parseInt(val, 10)).optional(),
      limit: z.string().transform(val => Number.parseInt(val, 10)).optional(),
      workoutExerciseId: z.string().transform(val => Number.parseInt(val, 10)).optional(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        sets: z.array(setResponseSchema),
        pagination: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      }),
      "The paginated sets",
    ),
  },
});

export type GetPaginatedSetsRoute = typeof getPaginatedSets;
