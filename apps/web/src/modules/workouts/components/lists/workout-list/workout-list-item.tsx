import { useNavigate } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

import { ListItem } from "@/web/components/ui";
import type { Workout } from "@/web/modules/workouts/types";

export const WorkoutItem = ({
  workout,
  selectionEnabled,
  isSelected,
  onToggle,
  onWorkoutClick,
}: {
  workout: Workout;
  selectionEnabled: boolean;
  isSelected: boolean;
  onToggle: (workout: Workout) => void;
  onWorkoutClick?: (workout: Workout) => void;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onWorkoutClick) {
      onWorkoutClick(workout);
    }
    else {
      navigate({
        to: "/workouts/$workoutId",
        params: { workoutId: String(workout.id) },
      });
    }
  };

  const handleToggle = () => {
    onToggle(workout);
  };

  return (
    <ListItem
      selectionEnabled={selectionEnabled}
      isSelected={isSelected}
      onToggle={handleToggle}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 justify-between w-full">
        <div className="flex-1">
          <p className="font-medium">{workout.name}</p>
          {workout.workoutExercises.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {workout.workoutExercises
                .map(workoutExercise => workoutExercise.exercise.name)
                .join(", ")}
              <span className="ml-1.5">
                ({workout.workoutExercises.length})
              </span>
            </p>
          )}
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
