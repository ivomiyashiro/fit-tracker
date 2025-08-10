import { toast } from "sonner";
import { useParams, useNavigate } from "@tanstack/react-router";

import { useCachedOrWorkoutByIdSuspenseQuery } from "@/web/modules/workouts/hooks/queries";
import { useUpdateWorkoutByIdMutation } from "@/web/modules/workouts/hooks/mutations";
import { useWorkoutExercisesSelectionForm } from "@/web/modules/workouts/hooks/forms";
import { AppHeader, Button } from "@/web/components/ui";
import { PageLayout } from "@/web/components/layouts";
import { ExerciseSelectionList } from "@/web/modules/workouts/components/lists/exercise-list";

const AddExerciseToWorkoutPage = () => {
  const { workoutId } = useParams({ from: "/workouts/$workoutId" });
  const navigate = useNavigate();

  const { selectedExercises, toggleSelection } = useWorkoutExercisesSelectionForm();

  const { data: workout } = useCachedOrWorkoutByIdSuspenseQuery(Number(workoutId));

  const { mutate: updateWorkout } = useUpdateWorkoutByIdMutation({
    onSuccess: () => {
      navigate({ to: "/workouts/$workoutId", params: { workoutId: String(workoutId) } });
    },
    onError: error => toast.error(error.message || "Failed to update workout"),
  });

  const workoutExerciseIds = workout?.workoutExercises.map(we => we.exercise.id) || [];

  const handleAddExercises = () => {
    updateWorkout({
      workoutId: Number(workoutId),
      workout: {
        name: workout.name,
        exerciseIds: [...workoutExerciseIds, ...selectedExercises.map(e => e.id)],
      },
    });
  };

  const isExerciseInWorkout = (exerciseId: number) => workoutExerciseIds.includes(exerciseId);

  return (
    <>
      <AppHeader
        title="Add Exercises"
        showBackButton
        onBackButtonClick={() =>
          navigate({ to: "/workouts/$workoutId", params: { workoutId: String(workoutId) } })
        }
      />
      <PageLayout
        meta={{ title: "Add Exercises", description: "Add exercises to workout" }}
        className="flex flex-col gap-8"
      >
        <ExerciseSelectionList
          selectedExercises={selectedExercises}
          toggleSelection={toggleSelection}
          isExerciseInWorkout={isExerciseInWorkout}
        />

        <div className="flex justify-end">
          <Button
            className="w-full"
            onClick={handleAddExercises}
            disabled={selectedExercises.length === 0}
          >
            Add exercise
          </Button>
        </div>
      </PageLayout>
    </>
  );
};

export default AddExerciseToWorkoutPage;
