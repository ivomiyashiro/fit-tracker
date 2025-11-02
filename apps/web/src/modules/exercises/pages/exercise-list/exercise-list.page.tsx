import { SquareMousePointerIcon } from "lucide-react";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button, SearchInput } from "@/web/components/ui";
import { ExercisesList } from "@/web/modules/exercises/pages/exercise-list/exercise-list/exercise-list.index";

import { useExercisesList } from "./exercise-list.page.hook";

export default function ExerciseListPage() {
  const {
    // Selection state
    selectionEnabled,
    toggleSelectionEnabled,
    selectedExercises,
    setSelectedExercisesFromList,

    // Search
    searchTerm,
    handleSearchChange,

    // Actions
    handleDeleteExercises,
    isDeletingExercises,

    // Data
    isSuccess,
    exercises,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
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
        <SearchInput
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search exercises..."
        />

        <div className="flex-1">
          <ExercisesList
            isSuccess={isSuccess}
            exercises={exercises}
            selectionEnabled={selectionEnabled}
            selectedExercises={selectedExercises}
            onSelectionChanged={setSelectedExercisesFromList}
          />
          {hasNextPage && (
            <div className="text-center py-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>

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
