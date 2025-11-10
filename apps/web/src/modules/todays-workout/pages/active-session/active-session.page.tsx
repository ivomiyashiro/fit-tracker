import { ChevronLeft, ChevronRight } from "lucide-react";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, AppHeaderTitle, Button, Spinner } from "@/web/components/ui";
import { CreateSetDrawer } from "@/web/modules/workouts/pages/workout-exercise-sets/create-set-drawer/create-set-drawer.index";
import { InfiniteSetList } from "@/web/modules/workouts/pages/workout-exercise-sets/set-list/set-list.index";

import { ExerciseNavigationHeader } from "../../components/exercise-navigation-header";
import { useActiveSession } from "./active-session.page.hook";

const ActiveSessionPage = () => {
  const {
    session,
    currentExercise,
    currentExerciseIndex,
    totalExercises,
    canGoPrevious,
    canGoNext,
    isLastExercise,
    isLoading,
    isFinishingWorkout,
    handlePreviousExercise,
    handleNextExercise,
    handleFinishWorkout,
    handleBack,
    isDrawerOpen,
    handleCloseDrawer,
  } = useActiveSession();

  if (isLoading || !session || !currentExercise) {
    return (
      <>
        <AppHeader
          title={<AppHeaderTitle title="Loading..." isLoading />}
          showBackButton
          onBackButtonClick={handleBack}
        />
        <PageLayout
          meta={{ title: "Active Workout", description: "Active workout session" }}
          className="flex flex-col gap-6"
        >
          <div className="text-center text-muted-foreground">Loading session...</div>
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title={<AppHeaderTitle title={session.workout.name} />}
        onBackButtonClick={handleBack}
      />
      <PageLayout
        meta={{ title: session.workout.name, description: "Active workout session" }}
        className="flex flex-col gap-6"
      >
        <ExerciseNavigationHeader
          exerciseName={currentExercise.exercise.name}
          currentIndex={currentExerciseIndex}
          totalExercises={totalExercises}
        />

        <div className="flex gap-2">
          <Button
            onClick={handlePreviousExercise}
            disabled={!canGoPrevious}
            variant="outline"
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {isLastExercise
? (
            <Button
              onClick={handleFinishWorkout}
              disabled={isFinishingWorkout}
              className="flex-1"
            >
              {isFinishingWorkout && <Spinner />}
              Finish Workout
            </Button>
          )
: (
            <Button
              onClick={handleNextExercise}
              disabled={!canGoNext}
              className="flex-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        <InfiniteSetList
          workoutId={session.workoutId}
          workoutExerciseId={currentExercise.id}
        />

        <CreateSetDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          workoutSessionId={session.id}
          workoutExerciseId={currentExercise.id}
        />
      </PageLayout>
    </>
  );
};

export default ActiveSessionPage;
