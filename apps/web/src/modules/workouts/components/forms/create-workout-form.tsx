import { Button, FormField } from "@/web/components/ui";
import { ExerciseSelectionList } from "@/web/modules/workouts/components/lists/exercise-list";
import { useWorkoutForm } from "@/web/modules/workouts/hooks/forms/use-workout.form";

export const CreateWorkoutForm = ({
  onSubmit,
  isPending = false,
  initialData,
  submitButtonText = "Save Workout",
}: {
  onSubmit: (data: { name: string; exerciseIds: number[] }) => void;
  isPending?: boolean;
  initialData?: {
    name?: string;
    exerciseIds?: number[];
  };
  submitButtonText?: string;
}) => {
  const { register, handleSubmit, errors, selectedExercises, toggleSelection, hasSelection }
    = useWorkoutForm({
      initialData,
      onSubmit,
    });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <FormField
          label="Workout Name"
          error={errors.name}
          register={register("name")}
          placeholder="Enter workout name"
        />
      </div>

      <ExerciseSelectionList
        selectedExercises={selectedExercises}
        toggleSelection={toggleSelection}
        isExerciseInWorkout={() => false}
      />

      <div className="mt-4">
        <Button type="submit" className="w-full" disabled={isPending || !hasSelection}>
          {submitButtonText}
        </Button>
      </div>
    </form>
  );
};
