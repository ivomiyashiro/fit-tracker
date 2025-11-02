export const exercisesQueryKeys = {
  all: ["exercises"] as const,
  lists: () => [...exercisesQueryKeys.all, "list"] as const,
  list: (filters: string) => [...exercisesQueryKeys.lists(), { filters }] as const,
  details: () => [...exercisesQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...exercisesQueryKeys.details(), id] as const,
};
