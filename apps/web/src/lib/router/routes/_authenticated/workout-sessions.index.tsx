import { createFileRoute } from "@tanstack/react-router";
import WorkoutSessionPage from "@/web/modules/workout-sessions/pages/workout-sessions/workout-sessions.page";

export const Route = createFileRoute("/_authenticated/workout-sessions/")({
  component: WorkoutSessionPage,
});
