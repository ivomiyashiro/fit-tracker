import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button, DeleteConfirmationButton } from "@/web/components/ui";
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
        showActionButton={true}
        title="Exercises"
        selectionMode={selectionEnabled}
        onSelectionModeToggle={toggleSelectionEnabled}
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
          Add New Exercise
        </Button>
        {selectedExercises.length > 0 && (
          <div className="flex justify-end">
            <DeleteConfirmationButton
              title={`Delete Exercise${selectedExercises.length > 1 ? "s" : ""}`}
              description={`Are you sure you want to delete ${selectedExercises.length} exercise${selectedExercises.length > 1 ? "s" : ""}? This action cannot be undone and will also remove ${selectedExercises.length > 1 ? "them" : "it"} from all workouts.`}
              buttonText={`Delete Exercise${selectedExercises.length > 1 ? "s" : ""}`}
              deletingText="Deleting..."
              confirmText="Delete"
              isDeleting={isDeletingExercises}
              onConfirm={handleDeleteExercises}
              variant="destructive"
              className="w-full"
            />
          </div>
        )}
      </PageLayout>
    </>
  );
}
