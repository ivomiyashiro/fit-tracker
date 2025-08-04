import * as HttpStatusCodes from "stoker/http-status-codes";

import type { SignUpRoute } from "@/server/auth/endpoints/sign-up.endpoint";
import type { AppRouteHandler } from "@/server/lib/types";

import { auth } from "@/server/lib/auth";

export const signUp: AppRouteHandler<SignUpRoute> = async (c) => {
  const { email, password, name } = c.req.valid("json");

  const result = await auth.api.signUpEmail({
    body: { email, password, name: name || "" },
  });

  if (!result) {
    return c.json({ message: "Email already exists" }, HttpStatusCodes.CONFLICT);
  }

  return c.json({
    id: result.user.id,
    email: result.user.email,
    name: result.user.name,
  }, HttpStatusCodes.CREATED);
};
