import { useNavigate } from "@tanstack/react-router";

import type { ItemClickEvent, SelectionChangedEvent } from "@/web/components/ui/list/list.types";
import type { Workout } from "@/web/modules/workouts/types";

import { List } from "@/web/components/ui";

import { WorkoutListItemTemplate } from "./workout-list-item-template";

type WorkoutsListProps = {
  workouts: Workout[];
  selectionEnabled?: boolean;
  selectedWorkouts?: Workout[];
  onSelectionChanged?: (selectedWorkouts: Workout[]) => void;
  onWorkoutClick?: (workout: Workout) => void;
};

export const WorkoutsList = ({
  workouts,
  selectionEnabled = false,
  selectedWorkouts = [],
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

  return (
    <List
      dataSource={workouts}
      displayExpr="name"
      keyExpr="id"
      noDataText="You don't have any workouts yet. Create a new workout to get started."
      onItemClick={handleItemClick}
      onSelectionChanged={handleSelectionChanged}
      selectByClick={true}
      selectedItemKeys={selectedWorkoutIds}
      selectionMode={selectionEnabled ? "multiple" : "none"}
      showSelectionControls={selectionEnabled}
      title="Your workouts"
      itemTemplate={({ itemData: workout }) => (
        <WorkoutListItemTemplate
          workout={workout}
          selectionEnabled={selectionEnabled}
        />
      )}
    />
  );
};
