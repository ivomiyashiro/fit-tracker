import { Link, Navigate } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button } from "@/web/components/ui";
import { WorkoutExerciseList } from "@/web/modules/workouts/pages/workout/workout-exercise-list/workout-exercise-list.index";

import { useWorkout } from "./workout.page.hook";

const WorkoutPage = () => {
  const {
    // Data
    isLoading,
    isError,
    workout,
    workoutId,

    // Actions
    handleBackNavigation,
  } = useWorkout();

  // Only redirect if there's an error or if finished loading and no workout found
  if (isError || (!isLoading && !workout)) {
    return <Navigate to="/workouts" />;
  }

  return (
    <>
      <AppHeader
        title={workout?.name || "Workout"}
        showBackButton
        onBackButtonClick={handleBackNavigation}
        showActionButton={false}
      />
      <PageLayout
        meta={{ title: "Workout", description: "Workout" }}
        className="flex flex-col gap-8"
      >
        <WorkoutExerciseList
          isLoading={isLoading}
          workoutExercises={workout?.workoutExercises || []}
        />
        <div className="flex justify-end flex-col gap-2">
          <Link to="/workouts/$workoutId/we/$workoutExerciseId/add-exercises" params={{ workoutId, workoutExerciseId: "1" }} className="w-full">
            <Button className="w-full" disabled={isLoading}>
              Edit Workout Exercises
            </Button>
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export default WorkoutPage;
