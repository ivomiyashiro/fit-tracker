import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { sessionResponseSchema } from "@/server/auth/dtos/responses";

const tags = ["Auth"];

export const getSession = createRoute({
  path: "/auth/session",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      sessionResponseSchema,
      "Current session information",
    ),
  },
});

export type GetSessionRoute = typeof getSession;
