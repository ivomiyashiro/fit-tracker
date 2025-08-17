import { createFileRoute } from "@tanstack/react-router";

import UpdateWorkoutExerciseSetPage from "@/web/modules/workouts/pages/workout-exercise-set/update-workout-exercise-set.page";

export const Route = createFileRoute(
  "/workouts/$workoutId/workout-exercises/$workoutExerciseId/sets/$setId/",
)({
  component: UpdateWorkoutExerciseSetPage,
});
