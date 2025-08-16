import { useState } from "react";

import { useDebounce } from "@/web/hooks";
import { Label, ListContainer, SearchInput } from "@/web/components/ui";
import { useInfiniteExercisesQuery } from "@/web/modules/workouts/hooks/queries/use-exercises.query";
import { InfiniteExerciseList } from "@/web/modules/workouts/components/lists/exercise-list/exercise-infinite-list";

type ExerciseSelectionListProps = {
  selectedExerciseIds: number[];
  toggleSelection: (exerciseId: number) => void;
  isExerciseInWorkout?: boolean;
}

export const ExerciseSelectionList = ({
  selectedExerciseIds,
  toggleSelection,
  isExerciseInWorkout = false,
}: ExerciseSelectionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteExercisesQuery(debouncedSearchTerm);

  const totalCount = data?.pages[0]?.pagination.total || 0;

  const allExercises = data?.pages.flatMap(page => page.data ?? []) || []

  return (
    <div className="flex flex-col gap-2">
      <div className="px-3">
        <Label>
          Available exercises ({totalCount} total)
        </Label>
      </div>

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search exercises by name or muscle group..."
      />

      <ListContainer>
        {totalCount === 0 ? (
          (
            <div className="flex flex-col gap-2 text-center items-center justify-center py-8">
              <p className="text-lg font-medium">No exercises found</p>
              <p className="text-sm text-muted-foreground">
                No exercises match "
                {searchTerm}
                ". Try a different search term.
              </p>
            </div>
          )
        ) : (
          <InfiniteExerciseList
            isLoading={isLoading}
            isError={isError}
            exercises={allExercises}
            selectedExerciseIds={selectedExerciseIds}
            toggleSelection={toggleSelection}
            isExerciseInWorkout={isExerciseInWorkout}
            hasNextPage={!!hasNextPage}
            fetchNextPage={fetchNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </ListContainer>
    </div>
  );
};
