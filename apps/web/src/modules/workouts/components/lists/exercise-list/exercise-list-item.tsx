import type { Exercise } from "@/web/modules/workouts/types";

import { ListItem } from "@/web/components/ui";

type ExerciseItemProps = {
  exercise: Exercise;
  isSelected: boolean;
  onToggle: (exercise: Exercise) => void;
};

export const ExerciseItem = ({
  exercise,
  isSelected,
  onToggle,
}: ExerciseItemProps) => {
  const handleToggle = () => {
    onToggle(exercise);
  };

  return (
    <ListItem
      selectionEnabled
      isSelected={isSelected}
      onToggle={handleToggle}
    >
      <div className="flex-1">
        <p className="font-medium">
          {exercise.name}
        </p>
        {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {exercise.muscleGroups.map(mg => mg.name).join(", ")}
          </p>
        )}
      </div>
    </ListItem>
  );
};
