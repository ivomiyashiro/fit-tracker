import { createFileRoute } from "@tanstack/react-router";

import ExerciseCreatePage from "@/web/modules/exercises/pages/exercise-create/exercise-create.page";

export const Route = createFileRoute("/_authenticated/exercises/create")({
  component: ExerciseCreatePage,
});
