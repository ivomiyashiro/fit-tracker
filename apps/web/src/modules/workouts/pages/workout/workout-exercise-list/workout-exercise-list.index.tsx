import { useNavigate, useParams } from "@tanstack/react-router";

import type { ItemClickEvent, SelectionChangedEvent } from "@/web/components/ui/list/list.types";
import type { WorkoutExercise } from "@/web/modules/workouts/types";

import { List } from "@/web/components/ui";
import { WorkoutExerciseListItemTemplate } from "@/web/modules/workouts/pages/workout/workout-exercise-list/workout-exercise-list";

export const WorkoutExerciseList = ({
  isSuccess,
  selectedExerciseIds,
  selectionEnabled,
  workoutExercises,
  onToggle,
}: {
  isSuccess: boolean;
  selectedExerciseIds: number[];
  selectionEnabled: boolean;
  workoutExercises: WorkoutExercise[];
  onToggle: (workoutExercise: WorkoutExercise) => void;
}) => {
  const navigate = useNavigate();
  const { workoutId } = useParams({ from: "/_authenticated/workouts/$workoutId/" });

  if (workoutExercises.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Oops! No exercises found</h3>
        <p className="text-muted-foreground">You don't have any exercises yet. Create a new exercise to get started.</p>
      </div>
    );
  }

  const handleSelectionChanged = (e: SelectionChangedEvent<WorkoutExercise>) => {
    e.addedItems.forEach(item => onToggle(item));
    e.removedItems.forEach(item => onToggle(item));
  };

  const handleItemClick = (e: ItemClickEvent<WorkoutExercise>) => {
    navigate({
      to: "/workouts/$workoutId/we/$workoutExerciseId/sets",
      params: { workoutId, workoutExerciseId: String(e.item.id) },
    });
  };

  return (
    <List
      dataSource={workoutExercises}
      displayExpr="name"
      isSuccess={isSuccess}
      keyExpr="id"
      noDataText="No workout exercises found"
      onItemClick={handleItemClick}
      onSelectionChanged={handleSelectionChanged}
      selectByClick={true}
      selectedItemKeys={selectedExerciseIds}
      selectionMode={selectionEnabled ? "multiple" : "none"}
      showSelectionControls={selectionEnabled}
      itemTemplate={({ itemData: workoutExercise }) => (
        <WorkoutExerciseListItemTemplate
          workoutExercise={workoutExercise}
          selectionEnabled={selectionEnabled}
        />
      )}
    />
  );
};
