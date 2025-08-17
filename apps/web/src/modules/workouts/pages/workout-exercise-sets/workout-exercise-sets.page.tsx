import { AppHeader, Button } from "@/web/components/ui";
import { PageLayout } from "@/web/components/layouts";
import { InfiniteSetList } from "@/web/modules/workouts/pages/workout-exercise-sets/infinite-set-list";
import { CreateSetDrawer } from "@/web/modules/workouts/pages/workout-exercise-sets/create-set-drawer";
import { useWorkoutExerciseSets } from "./workout-exercise-sets.page.hook";

const WorkoutExerciseSetsPage = () => {
  const {
    // Data
    exercise,
    workoutId,
    workoutExerciseId,
    allSets,

    // Query state
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,

    // UI state
    isCreateDrawerOpen,

    // Actions
    handleCreateDrawerClose,
    handleCreateDrawerOpen,
    handleBackNavigation,
  } = useWorkoutExerciseSets();

  return (
    <>
      <AppHeader
        title={`${exercise?.name}`}
        showBackButton
        onBackButtonClick={handleBackNavigation}
      />
      <PageLayout
        meta={{ title: "Workout Exercise Sets", description: "Workout Exercise Sets" }}
        className="flex flex-col gap-8"
      >
        <InfiniteSetList
          isLoading={isLoading}
          isError={isError}
          allSets={allSets}
          hasNextPage={!!hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
          workoutId={workoutId}
          workoutExerciseId={workoutExerciseId}
        />
        <Button onClick={handleCreateDrawerOpen}>Add Set</Button>
        <CreateSetDrawer
          isOpen={isCreateDrawerOpen}
          onClose={handleCreateDrawerClose}
          workoutExerciseId={workoutExerciseId}
        />
      </PageLayout>
    </>
  );
};

export default WorkoutExerciseSetsPage;
