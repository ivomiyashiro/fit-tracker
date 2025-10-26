import { useNavigate, useParams } from "@tanstack/react-router";

import { useWorkoutExerciseSetByIdQuery } from "@/web/modules/workouts/hooks/queries/use-workout-exercise-set-by-id.query";

export const useUpdateWorkoutExerciseSet = () => {
  const navigate = useNavigate();
  const { workoutId, workoutExerciseId, setId } = useParams({
    from: "/_authenticated/workouts/$workoutId/we/$workoutExerciseId/sets/$setId/",
  });

  const { data: setToUpdate, isLoading } = useWorkoutExerciseSetByIdQuery(Number(setId));

  const handleBackClick = () => {
    navigate({
      to: "/workouts/$workoutId/we/$workoutExerciseId/sets",
      params: {
        workoutId,
        workoutExerciseId,
      },
    });
  };

  return {
    // Data
    setToUpdate,
    workoutId,
    workoutExerciseId,
    setId: Number(setId),

    // UI state
    isLoading,

    // Actions
    handleBackClick,
  };
};
