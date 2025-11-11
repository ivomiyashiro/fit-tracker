import { Check, Dumbbell, Timer, TrendingUp } from "lucide-react";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, AppHeaderTitle, Button, Card } from "@/web/components/ui";

import { useWorkoutSummary } from "./workout-summary.page.hook";

const WorkoutSummaryPage = () => {
  const {
    summary,
    isLoading,
    handleFinish,
    formatDuration,
    formatWeight,
  } = useWorkoutSummary();

  if (isLoading || !summary) {
    return (
      <>
        <AppHeader title={<AppHeaderTitle title="Loading..." isLoading />} />
        <PageLayout
          meta={{ title: "Workout Summary", description: "Workout completion summary" }}
          className="flex flex-col gap-6"
        >
          <div className="text-center text-muted-foreground">Loading summary...</div>
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <AppHeader title={<AppHeaderTitle title="Workout Complete!" />} />
      <PageLayout
        meta={{ title: "Workout Summary", description: "Workout completion summary" }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{summary.session.workoutName}</h2>
            <p className="text-muted-foreground">Great job completing your workout!</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Timer className="w-4 h-4" />
                <span className="text-sm">Duration</span>
              </div>
              <p className="text-2xl font-bold">
                {formatDuration(summary.session.duration)}
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Dumbbell className="w-4 h-4" />
                <span className="text-sm">Total Sets</span>
              </div>
              <p className="text-2xl font-bold">{summary.stats.totalSets}</p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">Total Volume</span>
              </div>
              <p className="text-2xl font-bold">
                {formatWeight(summary.stats.totalVolume)}
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Dumbbell className="w-4 h-4" />
                <span className="text-sm">Exercises</span>
              </div>
              <p className="text-2xl font-bold">{summary.stats.exercisesCompleted}</p>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Exercise Breakdown</h3>
          {summary.exerciseBreakdown.map(exercise => (
            <Card key={exercise.exerciseName} className="p-4">
              <div className="flex flex-col gap-2">
                <h4 className="font-medium">{exercise.exerciseName}</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Sets</p>
                    <p className="font-medium">{exercise.sets}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Reps</p>
                    <p className="font-medium">{exercise.avgReps.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avg Weight</p>
                    <p className="font-medium">{formatWeight(exercise.avgWeight)}</p>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Total Volume</p>
                  <p className="font-medium">{formatWeight(exercise.volume)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button onClick={handleFinish} size="lg" className="mt-4">
          Finish
        </Button>
      </PageLayout>
    </>
  );
};

export default WorkoutSummaryPage;
