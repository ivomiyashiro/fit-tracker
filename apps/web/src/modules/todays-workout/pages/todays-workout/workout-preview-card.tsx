import type { Workout } from "@/web/modules/workouts/types";

import { CalendarDays } from "lucide-react";

import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/web/components/ui";

type WorkoutPreviewCardProps = {
  workout: Workout;
  lastSessionDate?: string | null;
};

export const WorkoutPreviewCard = ({ workout, lastSessionDate }: WorkoutPreviewCardProps) => {
  return (
    <Card className="border-2">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{workout.name}</CardTitle>
            <CardDescription>
              {workout.workoutExercises.length}
{" "}
exercise
{workout.workoutExercises.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            #
{workout.order}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {lastSessionDate && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>
Last completed:
{new Date(lastSessionDate).toLocaleDateString()}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
