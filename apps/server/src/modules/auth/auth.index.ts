import { auth } from "@/server/lib/auth.js";
import { createRouter } from "@/server/lib/create-app.js";

const router = createRouter()
  .on(["POST", "GET"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  });

export default router;
