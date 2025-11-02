import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

import { muscleGroupResponseSchema } from "@/server/modules/exercises/dtos/responses/index.js";

const tags = ["Exercises"];

export const listMuscleGroups = createRoute({
  path: "/muscle-groups",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      muscleGroupResponseSchema.array(),
      "List of all muscle groups",
    ),
  },
});

export type ListMuscleGroupsRoute = typeof listMuscleGroups;
