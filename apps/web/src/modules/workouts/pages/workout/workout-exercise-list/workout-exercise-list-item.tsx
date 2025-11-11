import type { WorkoutExercise } from "@/web/modules/workouts/types";

export const WorkoutExerciseListItem = ({
  workoutExercise,
}: {
  workoutExercise: WorkoutExercise;
}) => {
  return (
    <div className="flex flex-col justify-between w-full">
      <p className="font-medium">{workoutExercise.exercise.name}</p>
      <span className="text-muted-foreground text-xs">
        {workoutExercise.exercise.muscleGroups.map(x => x.name).join(", ")}
      </span>
    </div>
  );
};
