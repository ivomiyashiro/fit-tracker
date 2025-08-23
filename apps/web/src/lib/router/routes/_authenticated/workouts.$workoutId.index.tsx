import { createFileRoute } from "@tanstack/react-router";

import WorkoutPage from "@/web/modules/workouts/pages/workout/workout.page";

export const Route = createFileRoute("/_authenticated/workouts/$workoutId/")({
  component: WorkoutPage,
});
