import { createFileRoute } from "@tanstack/react-router";

import TodaysWorkoutPage from "@/web/modules/workout-sessions/pages/todays-workout/todays-workout.page";

export const Route = createFileRoute(
  "/_authenticated/workout-sessions/todays-workout/",
)({
  component: TodaysWorkoutPage,
});
