import { Badge } from "@/web/components/ui";

type Props = {
  exerciseName: string;
  currentIndex: number;
  totalExercises: number;
};

export const ExerciseNavigationHeader = ({
  exerciseName,
  currentIndex,
  totalExercises,
}: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{exerciseName}</h2>
        <Badge variant="secondary">
          {currentIndex + 1}
{" "}
/
{totalExercises}
        </Badge>
      </div>
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalExercises) * 100}%` }}
        />
      </div>
    </div>
  );
};
