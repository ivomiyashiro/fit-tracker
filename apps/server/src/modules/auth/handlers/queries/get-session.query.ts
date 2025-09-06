import * as HttpStatusCodes from "stoker/http-status-codes";

import type { GetSessionRoute } from "@/server/auth/endpoints/get-session.endpoint.js";
import type { AppRouteHandler } from "@/server/lib/types.js";

import { auth } from "@/server/lib/auth.js";

export const getSession: AppRouteHandler<GetSessionRoute> = async (c) => {
  const result = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!result) {
    return c.json({ user: null, session: null }, HttpStatusCodes.OK);
  }

  return c.json({
    user: result.user
      ? {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        }
      : null,
    session: result.session
      ? {
          id: result.session.id,
          token: result.session.token,
        }
      : null,
  }, HttpStatusCodes.OK);
};
