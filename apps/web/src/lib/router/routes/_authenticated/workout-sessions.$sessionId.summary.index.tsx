import { createFileRoute } from "@tanstack/react-router";
import WorkoutSummaryPage from "@/web/modules/workout-sessions/pages/workout-summary/workout-summary.page";

export const Route = createFileRoute(
  "/_authenticated/workout-sessions/$sessionId/summary/",
)({
  component: WorkoutSummaryPage,
});
