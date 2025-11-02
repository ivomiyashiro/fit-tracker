import type { MuscleGroupFull } from "@/web/modules/exercises/types";

import { useQuery } from "@tanstack/react-query";

import { muscleGroupsService } from "@/web/modules/exercises/services";
import { muscleGroupsQueryKeys } from "@/web/modules/exercises/utils";

export const useMuscleGroupsQuery = () => {
  return useQuery<MuscleGroupFull[]>({
    queryKey: muscleGroupsQueryKeys.all,
    queryFn: () => muscleGroupsService.getMuscleGroups(),
  });
};
