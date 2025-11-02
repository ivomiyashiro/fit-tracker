import type { AppRouteHandler } from "@/server/lib/types.js";
import type { MuscleGroupResponse } from "@/server/modules/muscle-groups/dtos/responses/index.js";
import type { ListMuscleGroupsRoute } from "@/server/modules/muscle-groups/endpoints/index.js";

import db from "@/server/db/index.js";

export const listMuscleGroups: AppRouteHandler<ListMuscleGroupsRoute> = async (c) => {
  const muscleGroups = await db.query.muscleGroup.findMany({
    orderBy: (muscleGroup, { asc }) => [asc(muscleGroup.name)],
  });

  const result: MuscleGroupResponse[] = muscleGroups.map(mg => ({
    id: mg.id,
    name: mg.name,
    createdAt: mg.createdAt.toISOString(),
    updatedAt: mg.updatedAt.toISOString(),
  }));

  return c.json(result);
};
