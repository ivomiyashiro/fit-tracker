import { useNavigate, useParams } from "@tanstack/react-router";

import { useWorkoutsQuery } from "@/web/modules/workouts/hooks/queries";

export const useWorkout = () => {
  const { workoutId } = useParams({ from: "/_authenticated/workouts/$workoutId/" });
  const navigate = useNavigate();

  const { data: workouts, isSuccess } = useWorkoutsQuery();

  const workout = workouts?.find(w => w.id === Number(workoutId));

  const handleBackNavigation = () => {
    navigate({ to: "/workouts" });
  };

  return {
    // Data
    isSuccess,
    workout,
    workoutId,

    // Actions
    handleBackNavigation,
  };
};
