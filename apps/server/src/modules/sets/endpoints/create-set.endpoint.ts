import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/server/lib/constants.js";
import { createSetSchema } from "@/server/sets/dtos/requests/index.js";
import { setResponseSchema } from "@/server/sets/dtos/responses/index.js";

const tags = ["Sets"];

export const createSet = createRoute({
  path: "/sets",
  method: "post",
  request: {
    body: jsonContentRequired(
      createSetSchema,
      "The set to create",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      setResponseSchema,
      "The created set",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Workout exercise not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(createSetSchema),
      "The validation error(s)",
    ),
  },
});

export type CreateSetRoute = typeof createSet;
