import { createFileRoute } from "@tanstack/react-router";

import WorkoutExerciseSetsPage from "@/web/modules/workouts/pages/workout-exercise-sets/workout-exercise-sets.page";

export const Route = createFileRoute(
  "/_authenticated/workouts/$workoutId/we/$workoutExerciseId/sets/",
)({
  component: WorkoutExerciseSetsPage,
});
