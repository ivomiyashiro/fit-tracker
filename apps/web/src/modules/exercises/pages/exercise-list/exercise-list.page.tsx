import { PlusIcon, SquareMousePointerIcon } from "lucide-react";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button } from "@/web/components/ui";
import { ExerciseSelectionList } from "@/web/modules/exercises/pages/exercise-list/exercise-list/exercise-list.index";

import { useExercisesList } from "./exercise-list.page.hook";

export default function ExerciseListPage() {
  const {
    // Selection state
    selectionEnabled,
    toggleSelectionEnabled,
    selectedExercises,
    setSelectedExercisesFromList,

    // Actions
    handleDeleteExercises,
    handleAddNewExercise,
    handleItemClick,
    isDeletingExercises,
  } = useExercisesList();

  return (
    <>
      <AppHeader
        actionButtonComponent={(
          <Button
            variant="secondary"
            className="w-9 h-9 text-muted-foreground"
            onClick={toggleSelectionEnabled}
          >
            <SquareMousePointerIcon className="w-4 h-4" />
          </Button>
        )}
        onActionButtonClick={toggleSelectionEnabled}
        showActionButton={true}
        title="Exercises"
      />
      <PageLayout
        meta={{ title: "Exercises", description: "Exercise library" }}
        className="flex flex-col gap-4"
      >
        <ExerciseSelectionList
          selectionEnabled={selectionEnabled}
          selectedExercises={selectedExercises}
          onItemClick={handleItemClick}
          onSelectionChanged={setSelectedExercisesFromList}
        />
        <Button className="w-full" onClick={handleAddNewExercise}>
          <PlusIcon className="w-4 h-4" />
          Add New Exercise
        </Button>
        {selectedExercises.length > 0 && (
          <div className="flex justify-end">
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDeleteExercises}
              disabled={isDeletingExercises}
            >
              Delete Exercise
              {selectedExercises.length > 1 ? "s" : ""}
            </Button>
          </div>
        )}
      </PageLayout>
    </>
  );
}
