import type { MuscleGroup } from "@/web/modules/exercises/types";

import { ChevronRightIcon } from "lucide-react";

export const MuscleGroupListItemTemplate = ({
  muscleGroup,
  selectionEnabled,
}: {
  muscleGroup: MuscleGroup;
  selectionEnabled: boolean;
}) => {
  return (
    <div className="flex items-center gap-2 justify-between w-full">
      <div className="flex-1">
        <p className="font-medium">{muscleGroup.name}</p>
      </div>
      {!selectionEnabled && (
        <div className="flex items-center justify-center group-hover:bg-muted transition-colors duration-300 min-w-6 min-h-6 rounded-full">
          <ChevronRightIcon className="size-4 ml-0.5" />
        </div>
      )}
    </div>
  );
};
