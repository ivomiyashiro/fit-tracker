import type { ItemClickEvent, ItemReorderedEvent } from "@/web/components/ui/list/list.types";

import type { WorkoutExercise } from "@/web/modules/workouts/types";
import { useNavigate, useParams } from "@tanstack/react-router";

import { List } from "@/web/components/ui";
import { useReorderWorkoutExercisesMutation } from "@/web/modules/workouts/hooks/mutations";
import { WorkoutExerciseListItem } from "@/web/modules/workouts/pages/workout/workout-exercise-list/workout-exercise-list-item";

type WorkoutExerciseListProps = {
  isLoading: boolean;
  workoutExercises: WorkoutExercise[];
};

export const WorkoutExerciseList = ({
  isLoading,
  workoutExercises,
}: WorkoutExerciseListProps) => {
  const navigate = useNavigate();
  const { workoutId } = useParams({ from: "/_authenticated/workouts/$workoutId/" });
  const reorderMutation = useReorderWorkoutExercisesMutation();

  if (workoutExercises.length === 0 && !isLoading) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Oops! No exercises found</h3>
        <p className="text-muted-foreground">You don't have any exercises yet. Create a new exercise to get started.</p>
      </div>
    );
  }

  const handleItemClick = (e: ItemClickEvent<WorkoutExercise>) => {
    navigate({
      to: "/workouts/$workoutId/we/$workoutExerciseId/sets",
      params: { workoutId, workoutExerciseId: String(e.item.id) },
    });
  };

  const handleReorder = (e: ItemReorderedEvent<WorkoutExercise>) => {
    if (workoutExercises.length === 0)
      return;

    // Usar el primer ejercicio como referencia (necesario para el endpoint)
    const firstExerciseId = workoutExercises[0]?.id;

    const reorderedExercises = e.reorderedItems.map((exercise, index) => ({
      id: exercise.id,
      order: index + 1,
    }));

    reorderMutation.mutate({
      workoutId: Number(workoutId),
      workoutExerciseId: firstExerciseId,
      exercises: reorderedExercises,
    });
  };

  return (
    <List
      dataSource={workoutExercises}
      displayExpr="name"
      isSuccess={!isLoading}
      keyExpr="id"
      noDataText="No workout exercises found"
      onItemClick={handleItemClick}
      onItemReordered={handleReorder}
      reorderEnabled={true}
      selectByClick={true}
      selectionMode="none"
      itemTemplate={({ itemData: workoutExercise }) => (
        <WorkoutExerciseListItem
          workoutExercise={workoutExercise}
        />
      )}
    />
  );
};
