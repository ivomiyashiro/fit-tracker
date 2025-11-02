import type { MuscleGroup } from "@/web/modules/exercises/types";

import { useSuspenseQuery } from "@tanstack/react-query";

import { muscleGroupsService } from "@/web/modules/exercises/services";
import { muscleGroupsQueryKeys } from "@/web/modules/exercises/utils";

export const useMuscleGroupsQuery = () => {
  return useSuspenseQuery<MuscleGroup[]>({
    queryKey: muscleGroupsQueryKeys.all,
    queryFn: () => muscleGroupsService.getMuscleGroups(),
  });
};
