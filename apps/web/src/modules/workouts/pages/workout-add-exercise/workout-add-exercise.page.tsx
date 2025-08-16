import { AppHeader, Button } from "@/web/components/ui";
import { PageLayout } from "@/web/components/layouts";
import { ExerciseSelectionList } from "@/web/modules/workouts/components/lists/exercise-list/exercise-list.index";
import { useWorkoutAddExercise } from "./workout-add-exercise.page.hook";

const WorkoutAddExercisePage = () => {
  const {
    workout,
    selectedExerciseIds,
    toggleSelection,
    handleAddExercises,
    handleBackNavigation,
    isExerciseInWorkout,
    isPending,
    isLoading,
  } = useWorkoutAddExercise();

  if (isLoading || !workout) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading workout...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppHeader
        title="Add Exercises"
        showBackButton
        onBackButtonClick={handleBackNavigation}
      />
      <PageLayout
        meta={{ title: "Add Exercises", description: "Add exercises to workout" }}
        className="flex flex-col gap-8"
      >
        <ExerciseSelectionList
          selectedExerciseIds={selectedExerciseIds}
          toggleSelection={toggleSelection}
          isExerciseInWorkout={isExerciseInWorkout}
        />
        <div className="flex justify-end">
          <Button
            className="w-full"
            onClick={handleAddExercises}
            disabled={selectedExerciseIds.length === 0}
          >
            Add exercise
          </Button>
        </div>
      </PageLayout>
    </>
  );
};

export default WorkoutAddExercisePage;
