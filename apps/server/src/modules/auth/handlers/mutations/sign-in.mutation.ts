import * as HttpStatusCodes from "stoker/http-status-codes";

import type { SignInRoute } from "@/server/auth/endpoints/sign-in.endpoint.js";
import type { AppRouteHandler } from "@/server/lib/types.js";

import { auth } from "@/server/lib/auth.js";

export const signIn: AppRouteHandler<SignInRoute> = async (c) => {
  const { email, password } = c.req.valid("json");

  const result = await auth.api.signInEmail({
    body: { email, password },
  });

  if (!result) {
    return c.json({ message: "Invalid credentials" }, HttpStatusCodes.UNAUTHORIZED);
  }

  return c.json({
    id: result.user.id,
    email: result.user.email,
    name: result.user.name,
  }, HttpStatusCodes.OK);
};
