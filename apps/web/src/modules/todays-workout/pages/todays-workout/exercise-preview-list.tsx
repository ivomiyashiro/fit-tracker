import type { WorkoutExercise } from "@/web/modules/workouts/types";

import { Card, CardDescription, CardHeader, CardTitle } from "@/web/components/ui";

type ExercisePreviewListProps = {
  exercises: WorkoutExercise[];
};

export const ExercisePreviewList = ({ exercises }: ExercisePreviewListProps) => {
  if (exercises.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No exercises in this workout</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {exercises.map((exercise, index) => (
        <Card key={exercise.id} className="border-l-4 border-l-primary rounded-l-none">
          <CardHeader className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {index + 1}
                </div>
                <div>
                  <CardTitle className="text-base">{exercise.exercise.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {exercise.exercise.muscleGroups.map(mg => mg.name).join(", ")}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
