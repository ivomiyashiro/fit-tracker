import { useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";

import {
  useCachedOrWorkoutSuspenseQuery,
  useCachedOrWorkoutExerciseSetsSuspenseQuery,
} from "@/web/modules/workouts/hooks/queries";

import { AppHeader, Button } from "@/web/components/ui";
import { PageLayout } from "@/web/components/layouts";
import { SetList } from "@/web/modules/workouts/components/lists";
import { CreateSetDrawer } from "@/web/modules/workouts/components/forms";

const WorkoutExerciseSetsPage = () => { 
  const { workoutId, workoutExerciseId } = useParams({ from: "/workouts/$workoutId/$workoutExerciseId" });
  const navigate = useNavigate();

  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  const { data: workouts } = useCachedOrWorkoutSuspenseQuery();
  const workout = workouts?.find(w => w.id === Number(workoutId));
  const exercise = workout?.workoutExercises.find(
    we => we.id === Number(workoutExerciseId)
  )?.exercise;

  const { data } = useCachedOrWorkoutExerciseSetsSuspenseQuery({
    workoutId: Number(workoutId),
    workoutExerciseId: Number(workoutExerciseId),
    pagination: {
      cursor: 0,
      limit: 10,
    },
  });

  const handleCreateDrawerClose = () => {
    setIsCreateDrawerOpen(false);
  };

  const workoutExerciseSetsGroupByDate = data.data.reduce(
    (acc, set) => {
      const date = new Date(set.createdAt).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(set);
      return acc;
    },
    {} as Record<string, GetWorkoutExerciseSetsResponse["data"]>
  );

  return (
    <>
      <AppHeader
        title={`${exercise?.name}`}
        showBackButton
        onBackButtonClick={() =>
          navigate({ to: "/workouts/$workoutId", params: { workoutId: String(workoutId) } })
        }
      />
      <PageLayout
        meta={{ title: "Workout Exercise Sets", description: "Workout Exercise Sets" }}
        className="flex flex-col gap-8"
      >
        {Object.entries(workoutExerciseSetsGroupByDate).map(([date, sets]) => (
          <div key={date} className="flex flex-col gap-2">
            <span className="text-sm font-semibold px-3 text-muted-foreground">{date}</span>
            <SetList
              sets={sets}
              workoutId={Number(workoutId)}
              workoutExerciseId={Number(workoutExerciseId)}
            />
          </div>
        ))}
        <Button onClick={() => setIsCreateDrawerOpen(true)}>Add Set</Button>
        <CreateSetDrawer
          isOpen={isCreateDrawerOpen}
          onClose={handleCreateDrawerClose}
          workoutId={Number(workoutId)}
          workoutExerciseId={Number(workoutExerciseId)}
        />
      </PageLayout>
    </>
  );
};

export default WorkoutExerciseSetsPage;
