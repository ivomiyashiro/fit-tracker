import { useParams, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { useWorkoutByIdQuery } from "@/web/modules/workouts/hooks/queries";
import { useUpdateWorkoutByIdMutation } from "@/web/modules/workouts/hooks/mutations";
import { useWorkoutExercisesSelectionForm } from "@/web/modules/workouts/hooks/forms";

export const useWorkoutAddExercise = () => {
  const { workoutId } = useParams({ from: "/workouts/$workoutId/add-exercises/" });
  const navigate = useNavigate();

  const { data: workout, isLoading } = useWorkoutByIdQuery(Number(workoutId));
  
  const { selectedExerciseIds, toggleSelection } = useWorkoutExercisesSelectionForm({
    initialData: workout?.workoutExercises?.map(we => we.exercise.id) ?? [],
  });

  const { mutate: updateWorkout, isPending } = useUpdateWorkoutByIdMutation({
    onSuccess: () => {
      navigate({ to: "/workouts/$workoutId", params: { workoutId: String(workoutId) } });
    },
    onError: error => toast.error(error.message || "Failed to update workout"),
  });

  const handleAddExercises = () => {
    if (!workout) return;
    
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

  const isExerciseInWorkout = (exerciseId: number) => {
    if (!workout) return false;
    return workout.workoutExercises.some(we => we.exercise.id === exerciseId);
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
    isExerciseInWorkout,
    
    // UI state
    isPending,
  };
};
