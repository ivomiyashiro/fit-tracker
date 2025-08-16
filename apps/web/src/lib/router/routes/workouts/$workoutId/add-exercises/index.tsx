import { createFileRoute } from "@tanstack/react-router";

import WorkoutAddExercisePage from "@/web/modules/workouts/pages/workout-add-exercise/workout-add-exercise.page";

export const Route = createFileRoute("/workouts/$workoutId/add-exercises/")({
  component: WorkoutAddExercisePage,
});
