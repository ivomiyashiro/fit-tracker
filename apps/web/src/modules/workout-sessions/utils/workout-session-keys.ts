export const workoutSessionKeys = {
  all: ["workout-sessions"] as const,
  active: () => [...workoutSessionKeys.all, "active"] as const,
  lists: () => [...workoutSessionKeys.all, "list"] as const,
  list: (year?: number, month?: number) => [...workoutSessionKeys.lists(), { year, month }] as const,
  details: () => [...workoutSessionKeys.all, "detail"] as const,
  detail: (id: number) => [...workoutSessionKeys.details(), id] as const,
  summaries: () => [...workoutSessionKeys.all, "summary"] as const,
  summary: (id: number) => [...workoutSessionKeys.summaries(), id] as const,
} as const;
