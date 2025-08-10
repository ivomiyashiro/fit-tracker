import type { GetWorkoutByIdResponse } from "@fit-tracker/api-client";

import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";

import { EmptyState, ListContainer, ListItem } from "@/web/components/ui";

const WorkoutExerciseItem = ({
  workoutExercise,
  selectionEnabled,
  isSelected,
  onToggle,
}: {
  workoutExercise: GetWorkoutByIdResponse["workoutExercises"][number];
  selectionEnabled: boolean;
  isSelected: boolean;
  onToggle: (exercise: GetWorkoutByIdResponse["workoutExercises"][number]["exercise"]) => void;
}) => {
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const handleToggle = () => {
    onToggle(workoutExercise.exercise);
  };

  return (
    <ListItem
      selectionEnabled={selectionEnabled}
      isSelected={isSelected}
      onToggle={handleToggle}
      onClick={() =>
        navigate({
          to: "/workouts/$workoutId/workout-exercises/$workoutExerciseId/sets",
          params: { workoutId: String(workoutId), workoutExerciseId: String(workoutExercise.id) },
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

export const WorkoutExerciseList = ({
  exercises,
  selectionEnabled,
  selectedExercises,
  onToggle,
}: {
  exercises: GetWorkoutByIdResponse["workoutExercises"];
  selectionEnabled: boolean;
  selectedExercises: GetWorkoutByIdResponse["workoutExercises"][number]["exercise"][];
  onToggle: (exercise: GetWorkoutByIdResponse["workoutExercises"][number]["exercise"]) => void;
}) => {
  if (exercises.length === 0) {
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
        {exercises.map(workoutExercise => (
          <WorkoutExerciseItem
            key={workoutExercise.id}
            workoutExercise={workoutExercise}
            selectionEnabled={selectionEnabled}
            isSelected={selectedExercises.includes(workoutExercise.exercise)}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </ListContainer>
  );
};
