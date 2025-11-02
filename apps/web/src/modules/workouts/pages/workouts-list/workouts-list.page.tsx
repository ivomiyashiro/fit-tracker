import { Link } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button, Spinner } from "@/web/components/ui";
import { WorkoutsList } from "@/web/modules/workouts/pages/workouts-list/workout-list/workout-list.index";

import { useWorkoutsList } from "./workouts-list.page.hook";

export default function WorkoutsListPage() {
  const {
    // Selection state
    selectionEnabled,
    toggleSelectionEnabled,
    selectedWorkouts,
    setSelectedWorkoutsFromList,

    // Actions
    handleDeleteWorkouts,

    // Data
    isDeletingWorkouts,
    isLoading,
    workouts,
  } = useWorkoutsList();

  return (
    <>
      <AppHeader
        showActionButton={true}
        title="Workouts"
        selectionMode={selectionEnabled}
        onSelectionModeToggle={toggleSelectionEnabled}
      />
      <PageLayout
        meta={{ title: "Workouts", description: "Workouts" }}
        className="flex flex-col gap-8"
      >
        <WorkoutsList
          isLoading={isLoading}
          workouts={workouts}
          selectionEnabled={selectionEnabled}
          selectedWorkouts={selectedWorkouts}
          onSelectionChanged={setSelectedWorkoutsFromList}
        />
        <div className="flex justify-end flex-col gap-2">
          {selectedWorkouts.length > 0 && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteWorkouts}
              disabled={isDeletingWorkouts}
            >
              {isDeletingWorkouts && <Spinner />}
              Delete Workouts
            </Button>
          )}
          <Link to="/workouts/create" className="w-full">
            <Button className="w-full" disabled={isLoading || isDeletingWorkouts}>
              Create Workout
            </Button>
          </Link>
        </div>
      </PageLayout>
    </>
  );
};
