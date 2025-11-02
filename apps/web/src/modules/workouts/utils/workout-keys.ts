export const workoutQueryKeys = {
  all: ["workouts"] as const,
  lists: () => [...workoutQueryKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) => [...workoutQueryKeys.lists(), filters] as const,
  details: () => [...workoutQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...workoutQueryKeys.details(), id] as const,
  next: () => [...workoutQueryKeys.all, "next"] as const,
} as const;
