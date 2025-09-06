import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import { setResponseSchema } from "@/server/sets/dtos/responses/index.js";
import { generatePaginatedSchema } from "@/server/utils/index.js";

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
    [HttpStatusCodes.OK]: jsonContent(generatePaginatedSchema(setResponseSchema), "The paginated sets"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      z.object({ message: z.string() }),
      "Not found",
    ),
  },
});

export type GetPaginatedSetsRoute = typeof getPaginatedSets;
