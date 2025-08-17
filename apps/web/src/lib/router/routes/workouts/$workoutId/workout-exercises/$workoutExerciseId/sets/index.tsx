import { createFileRoute } from "@tanstack/react-router";

import WorkoutExerciseSetsPage from "@/web/modules/workouts/pages/workout-exercise-sets/workout-exercise-sets.page";

export const Route = createFileRoute(
  "/workouts/$workoutId/workout-exercises/$workoutExerciseId/sets/",
)({
  component: WorkoutExerciseSetsPage,
});
