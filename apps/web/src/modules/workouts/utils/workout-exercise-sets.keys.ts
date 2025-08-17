export const workoutExerciseSetsQueryKeys = {
  all: ["workout-exercise-sets"] as const,
  lists: () => [...workoutExerciseSetsQueryKeys.all, "list"] as const,
  list: (workoutExerciseId: number, pagination?: { limit: number }) =>
    [
      ...workoutExerciseSetsQueryKeys.lists(),
      workoutExerciseId.toString(),
      pagination?.limit?.toString(),
    ] as const,
  details: () => [...workoutExerciseSetsQueryKeys.all, "detail"] as const,
  detail: (setId: number) => [...workoutExerciseSetsQueryKeys.details(), setId.toString()] as const,
  infinite: (workoutExerciseId: number, limit: number) =>
    [
      ...workoutExerciseSetsQueryKeys.all,
      "infinite",
      workoutExerciseId.toString(),
      limit.toString(),
    ] as const,
} as const;
