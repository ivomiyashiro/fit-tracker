import { cors } from "hono/cors";

export function corsMiddleware() {
  return cors({
    origin: ["http://localhost:3030", "http://localhost:5173"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });
}
