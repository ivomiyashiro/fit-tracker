import { useNavigate } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

import { EmptyState, ListContainer, ListItem } from "@/web/components/ui";

const WorkoutItem = ({
  workout,
  selectionEnabled,
  isSelected,
  onToggle,
  onWorkoutClick,
}: {
  workout: GetWorkoutsResponse[number];
  selectionEnabled: boolean;
  isSelected: boolean;
  onToggle: (workout: GetWorkoutsResponse[number]) => void;
  onWorkoutClick?: (workout: GetWorkoutsResponse[number]) => void;
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onWorkoutClick) {
      onWorkoutClick(workout);
    }
    else {
      navigate(`/workouts/${workout.id}`);
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
          {workout.workoutExercises && workout.workoutExercises.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
              {workout.workoutExercises
                .map(workoutExercise => workoutExercise.exercise.name)
                .join(", ")}
              <span className="ml-1.5">
                (
                {workout.workoutExercises.length}
                )
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

export const WorkoutsList = ({
  workouts,
  selectionEnabled = false,
  selectedWorkouts = [],
  onToggle,
  onWorkoutClick,
}: {
  workouts: GetWorkoutsResponse;
  selectionEnabled?: boolean;
  selectedWorkouts?: GetWorkoutsResponse[number][];
  onToggle?: (workout: GetWorkoutsResponse[number]) => void;
  onWorkoutClick?: (workout: GetWorkoutsResponse[number]) => void;
}) => {
  if (workouts.length === 0) {
    return (
      <EmptyState
        title="Oops! No workouts found"
        description="You don't have any workouts yet. Create a new workout to get started."
      />
    );
  }

  const handleToggle = (workout: GetWorkoutsResponse[number]) => {
    if (onToggle) {
      onToggle(workout);
    }
  };

  return (
    <ListContainer title="Your workouts">
      <ul>
        {workouts.map(workout => (
          <WorkoutItem
            key={workout.id}
            workout={workout}
            selectionEnabled={selectionEnabled}
            isSelected={selectedWorkouts.includes(workout)}
            onToggle={handleToggle}
            onWorkoutClick={onWorkoutClick}
          />
        ))}
      </ul>
    </ListContainer>
  );
};
