import type { ItemClickEvent, ItemReorderedEvent, SelectionChangedEvent } from "@/web/components/ui/list/list.types";

import type { Workout } from "@/web/modules/workouts/types";
import { useNavigate } from "@tanstack/react-router";

import { List } from "@/web/components/ui";
import { useReorderWorkoutsMutation } from "@/web/modules/workouts/hooks/mutations";

import { WorkoutListItemTemplate } from "./workout-list-item-template";

type WorkoutsListProps = {
  isLoading?: boolean;
  workouts: Workout[];
  selectionEnabled?: boolean;
  selectedWorkouts?: Workout[];
  onSelectionChanged?: (selectedWorkouts: Workout[]) => void;
  onWorkoutClick?: (workout: Workout) => void;
};

export const WorkoutsList = ({
  isLoading = false,
  selectedWorkouts = [],
  selectionEnabled = false,
  workouts,
  onSelectionChanged,
  onWorkoutClick,
}: WorkoutsListProps) => {
  const navigate = useNavigate();
  const reorderMutation = useReorderWorkoutsMutation();

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

  const handleReorder = (e: ItemReorderedEvent<Workout>) => {
    if (workouts.length === 0)
      return;

    const reorderedWorkouts = e.reorderedItems.map((workout, index) => ({
      id: workout.id,
      order: index + 1,
    }));

    reorderMutation.mutate({ workouts: reorderedWorkouts });
  };

  if (workouts.length === 0 && !isLoading) {
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
      isSuccess={!isLoading}
      displayExpr="name"
      keyExpr="id"
      onItemClick={handleItemClick}
      onItemReordered={handleReorder}
      onSelectionChanged={handleSelectionChanged}
      reorderEnabled={!selectionEnabled}
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
