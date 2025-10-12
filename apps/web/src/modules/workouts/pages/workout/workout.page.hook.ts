import { useNavigate, useParams } from "@tanstack/react-router";

import { useWorkoutByIdQuery } from "@/web/modules/workouts/hooks/queries";

export const useWorkout = () => {
  const { workoutId } = useParams({ from: "/_authenticated/workouts/$workoutId/" });
  const navigate = useNavigate();

  const { data: workout, isLoading, isRefetching, isError } = useWorkoutByIdQuery(Number(workoutId));

  const handleBackNavigation = () => {
    navigate({ to: "/workouts" });
  };

  return {
    // Data
    isLoading: isLoading || isRefetching,
    isError,
    workout,
    workoutId,

    // Actions
    handleBackNavigation,
  };
};
