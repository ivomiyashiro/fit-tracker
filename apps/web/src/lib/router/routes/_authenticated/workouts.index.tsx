import { createFileRoute } from "@tanstack/react-router";

import WorkoutsListPage from "@/web/modules/workouts/pages/workouts-list/workouts-list.page";

export const Route = createFileRoute("/_authenticated/workouts/")({
  component: WorkoutsListPage,
});
