import type { Exercise } from "@/web/modules/exercises/types";

import { ChevronRightIcon } from "lucide-react";

export const ExerciseListItemTemplate = ({
  exercise,
  selectionEnabled,
}: {
  exercise: Exercise;
  selectionEnabled: boolean;
}) => {
  return (
    <div className="flex items-center gap-2 justify-between w-full">
      <div className="flex-1">
        <p className="font-medium">{exercise.name}</p>
        {exercise.muscleGroups.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {exercise.muscleGroups
              .map(muscleGroup => muscleGroup.name)
              .join(", ")}
          </p>
        )}
      </div>
      {!selectionEnabled && (
        <div className="flex items-center justify-center group-hover:bg-muted transition-colors duration-300 min-w-6 min-h-6 rounded-full">
          <ChevronRightIcon className="size-4 ml-0.5" />
        </div>
      )}
    </div>
  );
};
