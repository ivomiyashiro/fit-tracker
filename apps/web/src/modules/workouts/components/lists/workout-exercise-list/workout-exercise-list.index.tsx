import type { WorkoutExercise } from "@/web/modules/workouts/types";

import { EmptyState, ListContainer } from "@/web/components/ui";
import { WorkoutExerciseItem } from "@/web/modules/workouts/components/lists/workout-exercise-list/workout-exercise-list";


export const WorkoutExerciseList = ({
  workoutExercises,
  selectionEnabled,
  selectedWorkoutExercises,
  onToggle,
}: {
  workoutExercises: WorkoutExercise[];
  selectionEnabled: boolean;
  selectedWorkoutExercises: WorkoutExercise[];
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
            isSelected={selectedWorkoutExercises.some(e => e.id === we.id)}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </ListContainer>
  );
};
