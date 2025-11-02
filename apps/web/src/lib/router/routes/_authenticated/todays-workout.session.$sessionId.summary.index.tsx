import { createFileRoute } from "@tanstack/react-router";
import WorkoutSummaryPage from "@/web/modules/todays-workout/pages/workout-summary/workout-summary.page";

export const Route = createFileRoute(
  "/_authenticated/todays-workout/session/$sessionId/summary/",
)({
  component: WorkoutSummaryPage,
});
