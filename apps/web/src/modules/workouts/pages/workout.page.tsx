import { SquareMousePointerIcon, PlusIcon } from "lucide-react";
import { Link, Navigate, useNavigate, useParams } from "@tanstack/react-router";
import { toast } from "sonner";

import { useCachedOrWorkoutSuspenseQuery } from "@/web/modules/workouts/hooks/queries";
import { useUpdateWorkoutByIdMutation } from "@/web/modules/workouts/hooks/mutations";
import { useWorkoutExercisesSelectionForm } from "@/web/modules/workouts/hooks/forms";
import { WorkoutExerciseList } from "@/web/modules/workouts/components/lists";
import { AppHeader, Button } from "@/web/components/ui";
import { PageLayout } from "@/web/components/layouts";

const WorkoutPage = () => {
  const { workoutId } = useParams({ from: "/workouts/$workoutId" });
  const navigate = useNavigate();

  const {
    selectionEnabled,
    toggleSelectionEnabled,
    selectedExercises,
    toggleSelection,
    clearSelection,
  } = useWorkoutExercisesSelectionForm();

  const { mutate: updateWorkout } = useUpdateWorkoutByIdMutation({
    onSuccess: () => {
      clearSelection();
      toggleSelectionEnabled();
    },
    onError: error => toast.error(error.message || "Failed to update workout"),
  });

  const { data: workouts } = useCachedOrWorkoutSuspenseQuery();
  const workout = workouts?.find(w => w.id === Number(workoutId));

  if (!workout) {
    return <Navigate to="/workouts" />;
  }

  return (
    <>
      <AppHeader
        title={workout.name}
        showBackButton
        onBackButtonClick={() => navigate({ to: "/workouts" })}
        actionButtonComponent={
          <Button
            variant="secondary"
            className="w-9 h-9 text-muted-foreground"
            onClick={toggleSelectionEnabled}
          >
            <SquareMousePointerIcon className="w-4 h-4" />
          </Button>
        }
        onActionButtonClick={toggleSelectionEnabled}
        showActionButton={workout.workoutExercises.length > 0}
      />
      <PageLayout
        meta={{ title: "Workout", description: "Workout" }}
        className="flex flex-col gap-8"
      >
        <WorkoutExerciseList
          exercises={workout.workoutExercises}
          selectionEnabled={selectionEnabled}
          selectedExercises={selectedExercises}
          onToggle={toggleSelection}
        />
        <div className="flex justify-end flex-col gap-2">
          {selectedExercises.length > 0 && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() =>
                updateWorkout({
                  workoutId: Number(workoutId),
                  workout: {
                    name: workout.name,
                    exerciseIds: workout.workoutExercises
                      .filter(e => !selectedExercises.includes(e.exercise))
                      .map(e => e.exercise.id),
                  },
                })
              }
            >
              Remove Exercises
            </Button>
          )}
          <Link to={`/workouts/${workoutId}/add-exercises`} className="w-full">
            <Button className="w-full">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Exercises
            </Button>
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export default WorkoutPage;
