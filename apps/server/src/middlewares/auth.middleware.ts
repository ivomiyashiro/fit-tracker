import type { Context, Next } from "hono";

import { HTTPException } from "hono/http-exception";

import { auth } from "@/server/lib/auth.js";
import { tryCatch } from "@/server/utils/index.js";

export async function requireAuth(context: Context, next: Next) {
  const result = await tryCatch(
    auth.api.getSession({
      headers: context.req.header() as any,
    }),
  );

  if (!result.success) {
    throw new HTTPException(401, {
      message: "Failed to verify authentication",
    });
  }

  const session = result.data;

  if (!session?.user) {
    throw new HTTPException(401, {
      message: "Authentication required to access this resource",
    });
  }

  context.set("auth", session);

  await next();
}
