import { EmptyState, ListContainer } from "@/web/components/ui";
import type { Workout } from "@/web/modules/workouts/types";
import { WorkoutItem } from "@/web/modules/workouts/components/lists/workout-list/workout-list-item";

type WorkoutsListProps = {
  workouts: Workout[];
  selectionEnabled ?: boolean;
  selectedWorkouts ?: Workout[];
  onToggle ?: (workout: Workout) => void;
  onWorkoutClick ?: (workout: Workout) => void;
}

export const WorkoutsList = ({
  workouts,
  selectionEnabled = false,
  selectedWorkouts = [],
  onToggle,
  onWorkoutClick,
}: WorkoutsListProps) => {
  if (workouts.length === 0) {
    return (
      <EmptyState
        title="Oops! No workouts found"
        description="You don't have any workouts yet. Create a new workout to get started."
      />
    );
  }

  const handleToggle = (workout: Workout) => {
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
            isSelected={selectedWorkouts.some(w => w.id === workout.id)}
            onToggle={handleToggle}
            onWorkoutClick={onWorkoutClick}
          />
        ))}
      </ul>
    </ListContainer>
  );
};
