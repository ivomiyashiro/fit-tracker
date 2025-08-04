import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { signUpRequestSchema } from "@/server/auth/dtos/requests";
import { errorResponseSchema, signUpResponseSchema } from "@/server/auth/dtos/responses";

const tags = ["Auth"];

export const signUp = createRoute({
  path: "/auth/sign-up",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(signUpRequestSchema, "Sign up credentials"),
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      signUpResponseSchema,
      "Successfully signed up",
    ),
    [HttpStatusCodes.CONFLICT]: jsonContent(errorResponseSchema, "Email already exists"),
  },
});

export type SignUpRoute = typeof signUp;
