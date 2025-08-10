import { SquareMousePointerIcon } from "lucide-react";

import { Link } from "@tanstack/react-router";

import { useCachedOrWorkoutSuspenseQuery } from "@/web/modules/workouts/hooks/queries";
import { useDeleteWorkoutMutation } from "@/web/modules/workouts/hooks/mutations";
import { useWorkoutsSelectionForm } from "@/web/modules/workouts/hooks/forms";
import { WorkoutsList } from "@/web/modules/workouts/components/lists/workout-list";
import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button } from "@/web/components/ui";

const WorkoutsListPage = () => {
  const {
    selectionEnabled,
    toggleSelectionEnabled,
    selectedWorkouts,
    toggleSelection,
    clearSelection,
  } = useWorkoutsSelectionForm();

  const { data: workouts } = useCachedOrWorkoutSuspenseQuery();
  const { mutate: deleteWorkouts, isPending: isDeletingWorkouts } = useDeleteWorkoutMutation({
    onSuccess: () => {
      clearSelection();
      toggleSelectionEnabled();
    },
  });

  return (
    <>
      <AppHeader
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
        showActionButton={workouts.length > 0}
        title="Workouts"
      />
      <PageLayout
        meta={{ title: "Workouts", description: "Workouts" }}
        className="flex flex-col gap-8"
      >
        <WorkoutsList
          workouts={workouts}
          selectionEnabled={selectionEnabled}
          selectedWorkouts={selectedWorkouts}
          onToggle={toggleSelection}
        />
        <div className="flex justify-end flex-col gap-2">
          {selectedWorkouts.length > 0 && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => deleteWorkouts(selectedWorkouts.map(w => w.id))}
              disabled={isDeletingWorkouts}
            >
              Delete Workouts
            </Button>
          )}
          <Link to="/workouts/create" className="w-full">
            <Button className="w-full" disabled={isDeletingWorkouts}>
              Create Workout
            </Button>
          </Link>
        </div>
      </PageLayout>
    </>
  );
};

export default WorkoutsListPage;
