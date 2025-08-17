import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

import type { WorkoutExercise } from "@/web/modules/workouts/types";

import { ListItem } from "@/web/components/ui";

type WorkoutExerciseListProps = {
  workoutExercise: WorkoutExercise;
  selectionEnabled: boolean;
  isSelected: boolean;
  onToggle: (workoutExercise: WorkoutExercise) => void;
};

export const WorkoutExerciseItem = ({
  workoutExercise,
  selectionEnabled,
  isSelected,
  onToggle,
}: WorkoutExerciseListProps) => {
  const { workoutId } = useParams({ from: "/_authenticated/workouts/$workoutId/" });
  const navigate = useNavigate();

  const handleToggle = () => {
    onToggle(workoutExercise);
  };

  return (
    <ListItem
      selectionEnabled={selectionEnabled}
      isSelected={isSelected}
      onSelectionChange={handleToggle}
      onClick={() =>
        navigate({
          to: "/workouts/$workoutId/we/$workoutExerciseId/sets",
          params: {
            workoutId,
            workoutExerciseId: workoutExercise.id.toString(),
          },
        })}
    >
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex-1">
          <p className="font-medium">{workoutExercise.exercise.name}</p>
        </div>
        {!selectionEnabled && (
          <div className="flex items-center justify-center group-hover:bg-muted transition-colors duration-300 min-w-6 min-h-6 rounded-full">
            <ChevronRightIcon className="size-4 ml-0.5" />
          </div>
        )}
      </div>
    </ListItem>
  );
};
