import { createFileRoute } from "@tanstack/react-router";

import TodaysWorkoutPage from "@/web/modules/todays-workout/pages/todays-workout/todays-workout.page";

export const Route = createFileRoute("/_authenticated/todays-workout/")({
  component: TodaysWorkoutPage,
});
