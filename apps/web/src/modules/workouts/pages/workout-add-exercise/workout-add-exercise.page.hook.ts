import { useNavigate, useParams } from "@tanstack/react-router";

import { useExerciseSelection } from "@/web/modules/workouts/components/exercise-list/use-exercise-selection.hook";
import { useUpdateWorkoutByIdMutation } from "@/web/modules/workouts/hooks/mutations";
import { useWorkoutByIdQuery } from "@/web/modules/workouts/hooks/queries";

export const useWorkoutAddExercise = () => {
  const navigate = useNavigate();
  const { workoutId } = useParams({ from: "/_authenticated/workouts/$workoutId/we/$workoutExerciseId/add-exercises/" });

  const { data: workout, isLoading } = useWorkoutByIdQuery(Number(workoutId));

  const { selectedExerciseIds, toggleSelection } = useExerciseSelection({
    selectedIds: workout?.workoutExercises?.map(we => we.exercise.id) ?? [],
  });

  const { mutate: updateWorkout, isPending } = useUpdateWorkoutByIdMutation(Number(workoutId));

  const handleAddExercises = () => {
    if (!workout) return;

    updateWorkout({
      name: workout.name,
      exerciseIds: selectedExerciseIds,
    }, {
      onSuccess: () => {
        navigate({ to: "/workouts/$workoutId", params: { workoutId: String(workoutId) } });
      }
    });
  };

  const handleBackNavigation = () => {
    navigate({ to: "/workouts/$workoutId", params: { workoutId: String(workoutId) } });
  };

  return {
    // Data
    workout,
    workoutId,
    isLoading,

    // Selection state
    selectedExerciseIds,
    toggleSelection,

    // Actions
    handleAddExercises,
    handleBackNavigation,

    // UI state
    isPending,
  };
};
