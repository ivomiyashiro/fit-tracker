export const workoutExerciseSetsQueryKeys = {
  all: ["workout-exercise-sets"] as const,
  lists: () => [...workoutExerciseSetsQueryKeys.all, "list"] as const,
  list: (workoutId: number, workoutExerciseId: number) =>
    [
      ...workoutExerciseSetsQueryKeys.lists(),
      workoutId.toString(),
      workoutExerciseId.toString(),
    ] as const,
} as const;
