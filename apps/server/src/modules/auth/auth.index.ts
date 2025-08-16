import { auth } from "@/server/lib/auth";
import { createRouter } from "@/server/lib/create-app";

const router = createRouter()
  .on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });
  // .openapi(endpoints.signIn, mutations.signIn)
  // .openapi(endpoints.signUp, mutations.signUp)
  // .openapi(endpoints.signOut, mutations.signOut)
  // .openapi(endpoints.getSession, queries.getSession);

export default router;
