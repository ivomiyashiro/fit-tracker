import type { ItemClickEvent, SelectionChangedEvent } from "@/web/components/ui/list/list.types";
import type { Exercise } from "@/web/modules/exercises/types";

import { List } from "@/web/components/ui";

import { ExerciseListItemTemplate } from "./exercise-list-item-template";

type ExercisesListProps = {
  isSuccess: boolean;
  exercises: Exercise[];
  selectionEnabled?: boolean;
  selectedExercises?: Exercise[];
  onSelectionChanged?: (selectedExercises: Exercise[]) => void;
  onExerciseClick?: (exercise: Exercise) => void;
};

export const ExercisesList = ({
  isSuccess,
  selectedExercises = [],
  selectionEnabled = false,
  exercises,
  onSelectionChanged,
  onExerciseClick,
}: ExercisesListProps) => {
  const selectedExerciseIds = selectedExercises.map(e => e.id);

  const handleSelectionChanged = (e: SelectionChangedEvent<Exercise>) => {
    onSelectionChanged?.(e.selectedItems);
  };

  const handleItemClick = (e: ItemClickEvent<Exercise>) => {
    if (onExerciseClick) {
      onExerciseClick(e.item);
    }
    else {
      // TODO: Implement exercise detail page
      // navigate({
      //   to: "/exercises/$exerciseId",
      //   params: { exerciseId: String(e.item.id) },
      // });
    }
  };

  if (exercises.length === 0) {
    return (
      <div className="text-center pt-8">
        <h3 className="text-lg font-semibold mb-2">No exercises found.</h3>
        <p className="text-muted-foreground">Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <List
      dataSource={exercises}
      displayExpr="name"
      keyExpr="id"
      isSuccess={isSuccess}
      onItemClick={handleItemClick}
      onSelectionChanged={handleSelectionChanged}
      selectByClick={true}
      selectedItemKeys={selectedExerciseIds}
      selectionMode={selectionEnabled ? "multiple" : "none"}
      showSelectionControls={selectionEnabled}
      itemTemplate={({ itemData: exercise }) => (
        <ExerciseListItemTemplate
          exercise={exercise}
          selectionEnabled={selectionEnabled}
        />
      )}
    />
  );
};
