import type { Exercise } from "@/web/modules/workouts/types";

type ExerciseItemProps = {
  exercise: Exercise;
};

export const ExerciseListItem = ({
  exercise,
}: ExerciseItemProps) => {
  return (
    <div className="flex-1">
      <p className="font-medium">
        {exercise.name}
      </p>
      {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {exercise.muscleGroups.map(mg => mg.name).join(", ")}
        </p>
      )}
    </div>
  );
};
