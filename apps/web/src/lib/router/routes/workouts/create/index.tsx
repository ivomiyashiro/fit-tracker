import { createFileRoute } from "@tanstack/react-router";

import CreateWorkoutPage from "@/web/modules/workouts/pages/workouts-create/workouts-create.page";

export const Route = createFileRoute("/workouts/create/")({
  component: CreateWorkoutPage,
});
