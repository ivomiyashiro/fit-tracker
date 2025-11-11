import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Skeleton } from "@/web/components/ui";
import { ExercisePreviewList } from "./exercise-preview-list";
import { useTodaysWorkout } from "./todays-workout.page.hook";

import { WorkoutPreviewCard } from "./workout-preview-card";

const TodaysWorkoutPage = () => {
  const {
    nextWorkout,
    activeSession,
    isLoading,
    handleBack,
  } = useTodaysWorkout();

  const displayWorkout = activeSession?.workout || nextWorkout;
  const isActiveWorkout = !!activeSession;

  // Create a compatible workout object for WorkoutPreviewCard
  const workoutForPreview = displayWorkout
? {
    ...displayWorkout,
    createdAt: activeSession?.createdAt || nextWorkout?.createdAt || "",
    updatedAt: activeSession?.updatedAt || nextWorkout?.updatedAt || "",
  }
: null;

  return (
    <>
      <AppHeader
        title="Today's Workout"
        showBackButton
        onBackButtonClick={handleBack}
      />
      <PageLayout
        meta={{ title: "Today's Workout", description: "Start your workout for today" }}
        className="flex flex-col gap-6"
      >
        {isLoading
? (
          <>
            <Skeleton className="h-32 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </>
        )
: workoutForPreview
? (
          <>
            <WorkoutPreviewCard
              workout={workoutForPreview}
              lastSessionDate={isActiveWorkout ? activeSession!.createdAt : nextWorkout?.createdAt}
            />

            <div>
              <h3 className="text-lg font-semibold mb-3">
                {isActiveWorkout ? "Active Workout - Exercises" : "Exercises"}
              </h3>
              <ExercisePreviewList
                exercises={workoutForPreview.workoutExercises}
              />
            </div>
          </>
        )
: (
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">No workouts available</h3>
            <p className="text-muted-foreground">Create your first workout to get started!</p>
          </div>
        )}
      </PageLayout>
    </>
  );
};

export default TodaysWorkoutPage;
