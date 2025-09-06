import { useNavigate } from "@tanstack/react-router";

import type { ItemClickEvent, SelectionChangedEvent } from "@/web/components/ui/list/list.types";
import type { Workout } from "@/web/modules/workouts/types";

import { List } from "@/web/components/ui";

import { WorkoutListItemTemplate } from "./workout-list-item-template";

type WorkoutsListProps = {
  isSuccess: boolean;
  workouts: Workout[];
  selectionEnabled?: boolean;
  selectedWorkouts?: Workout[];
  onSelectionChanged?: (selectedWorkouts: Workout[]) => void;
  onWorkoutClick?: (workout: Workout) => void;
};

export const WorkoutsList = ({
  isSuccess,
  selectedWorkouts = [],
  selectionEnabled = false,
  workouts,
  onSelectionChanged,
  onWorkoutClick,
}: WorkoutsListProps) => {
  const navigate = useNavigate();

  const selectedWorkoutIds = selectedWorkouts.map(w => w.id);

  const handleSelectionChanged = (e: SelectionChangedEvent<Workout>) => {
    onSelectionChanged?.(e.selectedItems);
  };

  const handleItemClick = (e: ItemClickEvent<Workout>) => {
    if (onWorkoutClick) {
      onWorkoutClick(e.item);
    }
    else {
      navigate({
        to: "/workouts/$workoutId",
        params: { workoutId: String(e.item.id) },
      });
    }
  };

  if (workouts.length === 0) {
    return (
      <div className="text-center pt-8">
        <h3 className="text-lg font-semibold mb-2">You don't have any workouts yet.</h3>
        <p className="text-muted-foreground">Create a new workout to get started.</p>
      </div>
    );
  }

  return (
    <List
      dataSource={workouts}
      displayExpr="name"
      keyExpr="id"
      isSuccess={isSuccess}
      onItemClick={handleItemClick}
      onSelectionChanged={handleSelectionChanged}
      selectByClick={true}
      selectedItemKeys={selectedWorkoutIds}
      selectionMode={selectionEnabled ? "multiple" : "none"}
      showSelectionControls={selectionEnabled}
      itemTemplate={({ itemData: workout }) => (
        <WorkoutListItemTemplate
          workout={workout}
          selectionEnabled={selectionEnabled}
        />
      )}
    />
  );
};
