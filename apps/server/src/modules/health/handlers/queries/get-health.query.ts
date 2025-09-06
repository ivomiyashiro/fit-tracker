import * as HttpStatusCodes from "stoker/http-status-codes";

import type { CheckHealthRoute } from "@/server/health/endpoints/check-health.endpoint.js";
import type { AppRouteHandler } from "@/server/lib/types.js";

export const getHealth: AppRouteHandler<CheckHealthRoute> = async (c) => {
  return c.json("OK", HttpStatusCodes.OK);
};
