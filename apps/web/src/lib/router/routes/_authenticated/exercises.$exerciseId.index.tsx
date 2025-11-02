import { createFileRoute } from "@tanstack/react-router";
import ExercisePage from "@/web/modules/exercises/pages/exercise/exercise.page";

export const Route = createFileRoute("/_authenticated/exercises/$exerciseId/")({
  component: ExercisePage,
});
