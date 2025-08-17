import type { WorkoutExercise } from "@/web/modules/workouts/types";

import { EmptyState, ListContainer } from "@/web/components/ui";
import { WorkoutExerciseItem } from "@/web/modules/workouts/components/lists/workout-exercise-list/workout-exercise-list";

export const WorkoutExerciseList = ({
  workoutExercises,
  selectionEnabled,
  selectedExerciseIds,
  onToggle,
}: {
  workoutExercises: WorkoutExercise[];
  selectionEnabled: boolean;
  selectedExerciseIds: number[];
  onToggle: (workoutExercise: WorkoutExercise) => void;
}) => {
  if (workoutExercises.length === 0) {
    return (
      <EmptyState
        title="Oops! No exercises found"
        description="You don't have any exercises yet. Create a new exercise to get started."
      />
    );
  }

  return (
    <ListContainer title="Workout exercises">
      <ul>
        {workoutExercises.map(we => (
          <WorkoutExerciseItem
            key={we.id}
            workoutExercise={we}
            selectionEnabled={selectionEnabled}
            isSelected={selectedExerciseIds.includes(we.id)}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </ListContainer>
  );
};
