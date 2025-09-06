import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button } from "@/web/components/ui";
import { ExerciseSelectionList } from "@/web/modules/workouts/components/exercise-list/exercise-list.index";

import { useWorkoutAddExercise } from "./workout-add-exercise.page.hook";

const WorkoutAddExercisePage = () => {
  const {
    // Data
    selectedExercises,
    handleSelectionChanged,

    // Actions
    handleAddExercises,
    handleBackNavigation,
  } = useWorkoutAddExercise();

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
          selectedExercises={selectedExercises}
          onSelectionChanged={handleSelectionChanged}
          searchPlaceholder="Search exercises to include in workout..."
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

export default WorkoutAddExercisePage;
