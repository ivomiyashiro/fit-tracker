export const exercisesQueryKeys = {
  all: ["exercises"] as const, //
  lists: () => [...exercisesQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...exercisesQueryKeys.lists(), filters] as const,
  infinite: (search?: string) => [...exercisesQueryKeys.all, "infinite", search] as const,
  details: () => [...exercisesQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...exercisesQueryKeys.details(), id] as const,
} as const;
