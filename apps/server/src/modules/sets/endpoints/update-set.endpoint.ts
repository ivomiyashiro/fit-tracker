import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

import { notFoundSchema } from "@/server/lib/constants.js";
import { updateSetSchema } from "@/server/sets/dtos/requests/index.js";
import { setResponseSchema } from "@/server/sets/dtos/responses/index.js";

const tags = ["Sets"];

export const updateSet = createRoute({
  path: "/sets/{id}",
  method: "put",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      updateSetSchema,
      "The set data to update",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      setResponseSchema,
      "The updated set",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Set not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateSetSchema)
        .or(createErrorSchema(IdParamsSchema)),
      "The validation error(s)",
    ),
  },
});

export type UpdateSetRoute = typeof updateSet;
