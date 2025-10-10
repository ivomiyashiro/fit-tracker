import type { WorkoutExercise } from "@/web/modules/workouts/types";

import { ChevronRightIcon } from "lucide-react";

export const WorkoutExerciseListItemTemplate = ({
  workoutExercise,
}: {
  workoutExercise: WorkoutExercise;
}) => {
  return (
    <div className="flex items-center gap-2 justify-between w-full">
      <div className="flex-1">
        <p className="font-medium">{workoutExercise.exercise.name}</p>
      </div>
      <div className="flex items-center justify-center group-hover:bg-muted transition-colors duration-300 min-w-6 min-h-6 rounded-full">
        <ChevronRightIcon className="size-4 ml-0.5" />
      </div>
    </div>
  );
};
