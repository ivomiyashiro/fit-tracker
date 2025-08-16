import { SquareMousePointerIcon, PlusIcon } from "lucide-react";
import { Link, Navigate } from "@tanstack/react-router";

import { WorkoutExerciseList } from "@/web/modules/workouts/components/lists";
import { AppHeader, Button } from "@/web/components/ui";
import { PageLayout } from "@/web/components/layouts";
import { useWorkout } from "./workout.page.hook";

const WorkoutPage = () => {
  const {
    workout,
    workoutId,
    selectionEnabled,
    toggleSelectionEnabled,
    selectedExerciseIds,
    toggleSelection,
    selectedWorkoutExercises,
    handleDeleteWorkoutExercise,
    handleBackNavigation,
  } = useWorkout();

  if (!workout) {
    return <Navigate to="/workouts" />;
  }

  return (
    <>
      <AppHeader
        title={workout.name}
        showBackButton
        onBackButtonClick={handleBackNavigation}
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
          workoutExercises={workout.workoutExercises}
          selectionEnabled={selectionEnabled}
          selectedWorkoutExercises={selectedWorkoutExercises}
          onToggle={(workoutExercise) => toggleSelection(workoutExercise.id)}
        />
        <div className="flex justify-end flex-col gap-2">
          {selectedExerciseIds.length > 0 && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteWorkoutExercise}
            >
              Remove Exercises
            </Button>
          )}
          <Link to="/workouts/$workoutId/add-exercises" params={{ workoutId }} className="w-full">
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
