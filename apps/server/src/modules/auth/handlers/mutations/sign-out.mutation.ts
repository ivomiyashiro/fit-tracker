import * as HttpStatusCodes from "stoker/http-status-codes";

import type { SignOutRoute } from "@/server/auth/endpoints/sign-out.endpoint.js";
import type { AppRouteHandler } from "@/server/lib/types.js";

import { auth } from "@/server/lib/auth.js";

export const signOut: AppRouteHandler<SignOutRoute> = async (c) => {
  await auth.api.signOut({
    headers: c.req.raw.headers,
  });

  return c.json({ message: "Successfully signed out" }, HttpStatusCodes.OK);
};
