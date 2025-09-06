import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import { workoutResponseSchema } from "@/server/workouts/dtos/responses/index.js";

const tags = ["Workouts"];

export const listWorkouts = createRoute({
  path: "/workouts",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(workoutResponseSchema),
      "The list of workouts",
    ),
  },
});

export type ListRoute = typeof listWorkouts;
