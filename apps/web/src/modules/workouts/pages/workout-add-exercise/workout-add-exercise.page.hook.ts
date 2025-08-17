import { useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";

import { useExerciseSelection } from "@/web/modules/workouts/hooks/forms/use-exercise-selection.hook";
import { useUpdateWorkoutByIdMutation } from "@/web/modules/workouts/hooks/mutations";
import { useWorkoutByIdQuery } from "@/web/modules/workouts/hooks/queries";

export const useWorkoutAddExercise = () => {
  const { workoutId } = useParams({ from: "/workouts/$workoutId/add-exercises/" });
  const navigate = useNavigate();

  const { data: workout, isLoading } = useWorkoutByIdQuery(Number(workoutId));

  const { selectedExerciseIds, toggleSelection } = useExerciseSelection({
    initialIds: workout?.workoutExercises?.map(we => we.exercise.id) ?? [],
  });

  const { mutate: updateWorkout, isPending } = useUpdateWorkoutByIdMutation({
    onSuccess: () => {
      navigate({ to: "/workouts/$workoutId", params: { workoutId: String(workoutId) } });
    },
    onError: error => toast.error(error.message || "Failed to update workout"),
  });

  const handleAddExercises = () => {
    if (!workout)
      return;

    updateWorkout({
      workoutId: Number(workoutId),
      workout: {
        name: workout.name,
        exerciseIds: selectedExerciseIds,
      },
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
