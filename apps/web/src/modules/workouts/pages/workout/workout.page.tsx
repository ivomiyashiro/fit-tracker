import { Link, Navigate } from "@tanstack/react-router";
import { EditIcon } from "lucide-react";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button } from "@/web/components/ui";
import { WorkoutExerciseList } from "@/web/modules/workouts/pages/workout/workout-exercise-list/workout-exercise-list.index";

import { useWorkout } from "./workout.page.hook";

const WorkoutPage = () => {
  const {
    // Data
    isSuccess,
    workout,
    workoutId,

    // Actions
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
        showActionButton={false}
      />
      <PageLayout
        meta={{ title: "Workout", description: "Workout" }}
        className="flex flex-col gap-8"
      >
        <WorkoutExerciseList
          isSuccess={isSuccess}
          workoutExercises={workout.workoutExercises}
        />
        <div className="flex justify-end flex-col gap-2">
          <Link to="/workouts/$workoutId/we/$workoutExerciseId/add-exercises" params={{ workoutId, workoutExerciseId: "1" }} className="w-full">
            <Button className="w-full">
              <EditIcon className="w-4 h-4 mr-1 mt-0.5" />
              Edit Workout Exercises
            </Button>
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export default WorkoutPage;
