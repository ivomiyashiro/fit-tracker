export const muscleGroupsQueryKeys = {
  all: ["muscle-groups"] as const,
  lists: () => [...muscleGroupsQueryKeys.all, "list"] as const,
  list: (filters: string) => [...muscleGroupsQueryKeys.lists(), { filters }] as const,
  details: () => [...muscleGroupsQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...muscleGroupsQueryKeys.details(), id] as const,
};
