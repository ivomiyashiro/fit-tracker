import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";

const tags = ["Health"];

export const checkHealth = createRoute({
  path: "/health",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: {
      description: "Health check successful",
    },
  },
});

export type CheckHealthRoute = typeof checkHealth;
