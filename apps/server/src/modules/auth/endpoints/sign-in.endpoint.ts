import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { signInRequestSchema } from "@/server/auth/dtos/requests";
import { errorResponseSchema, signInResponseSchema } from "@/server/auth/dtos/responses";

const tags = ["Auth"];

export const signIn = createRoute({
  path: "/auth/sign-in",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(signInRequestSchema, "Sign in credentials"),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      signInResponseSchema,
      "Successfully signed in",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorResponseSchema,
      "Invalid credentials",
    ),
  },
});

export type SignInRoute = typeof signIn;
