import { createFileRoute } from "@tanstack/react-router";
import ExerciseListPage from "@/web/modules/exercises/pages/exercise-list/exercise-list.page";

export const Route = createFileRoute("/_authenticated/exercises/")({
  component: ExerciseListPage,
});
