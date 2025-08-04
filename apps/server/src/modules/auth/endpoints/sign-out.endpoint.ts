import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { signOutResponseSchema } from "@/server/auth/dtos/responses";

const tags = ["Auth"];

export const signOut = createRoute({
  path: "/auth/sign-out",
  method: "post",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      signOutResponseSchema,
      "Successfully signed out",
    ),
  },
});

export type SignOutRoute = typeof signOut;
