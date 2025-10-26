import { PlusIcon } from "lucide-react";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, AppHeaderTitle, Button } from "@/web/components/ui";
import { CreateSetDrawer } from "@/web/modules/workouts/pages/workout-exercise-sets/create-set-drawer/create-set-drawer.index";
import { InfiniteSetList } from "@/web/modules/workouts/pages/workout-exercise-sets/set-list/set-list.index";

import { useWorkoutExerciseSets } from "./workout-exercise-sets.page.hook";

const WorkoutExerciseSetsPage = () => {
  const {
    // Data
    exercise,
    workoutId,
    workoutExerciseId,

    // UI state
    isCreateDrawerOpen,
    isWorkoutsLoading,

    // Actions
    handleCreateDrawerClose,
    handleCreateDrawerOpen,
    handleBackNavigation,
  } = useWorkoutExerciseSets();

  return (
    <>
      <AppHeader
        title={<AppHeaderTitle title={exercise?.name} isLoading={isWorkoutsLoading} />}
        showBackButton
        onBackButtonClick={handleBackNavigation}
      />
      <PageLayout
        meta={{ title: "Workout Exercise Sets", description: "Workout Exercise Sets" }}
        className="flex flex-col gap-8"
      >
        <InfiniteSetList
          workoutId={workoutId}
          workoutExerciseId={workoutExerciseId}
        />
        <Button onClick={handleCreateDrawerOpen}>
          <PlusIcon className="w-4 h-4 mt-0.5" />
          Add Set
        </Button>
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
