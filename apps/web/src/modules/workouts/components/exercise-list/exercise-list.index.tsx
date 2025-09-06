import { useState } from "react";

import type { SelectionChangedEvent } from "@/web/components/ui/list/list.types";
import type { Exercise } from "@/web/modules/workouts/types";

import { List } from "@/web/components/ui";
import { useDebounce } from "@/web/hooks";
import { useInfiniteExercisesQuery } from "@/web/modules/workouts/hooks/queries/use-exercises.query";

import { ExerciseListItem } from "./exercise-list-item";

type ExerciseSelectionListProps = {
  onSelectionChanged?: (exercises: Exercise[]) => void;
  searchPlaceholder?: string;
  selectedExercises?: Exercise[];
};

export const ExerciseSelectionList = ({
  onSelectionChanged,
  searchPlaceholder = "Search exercises by name or muscle group...",
  selectedExercises,
}: ExerciseSelectionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const selectedExercisesIds = selectedExercises?.map(e => e.id) || [];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isSuccess,
  } = useInfiniteExercisesQuery(debouncedSearchTerm);

  const allExercises = data?.pages.flatMap(page => page.data ?? []) || [];

  const handleSelectionChanged = (e: SelectionChangedEvent<Exercise>) => {
    onSelectionChanged?.(e.selectedItems);
  };

  if (isError) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Error loading exercises</h3>
        <p className="text-muted-foreground">There was an error loading exercises. Please try again.</p>
      </div>
    );
  }

  return (
    <List
      dataSource={allExercises}
      hasNextPage={hasNextPage}
      height="400px"
      infiniteScrollEnabled={true}
      isFetchingNextPage={isFetchingNextPage}
      isSuccess={isSuccess}
      keyExpr="id"
      loadingMoreText="Loading more exercises..."
      loadMoreText="Load more exercises"
      noDataText={searchTerm ? `No exercises match "${searchTerm}". Try a different search term.` : "No exercises available."}
      onLoadMore={fetchNextPage}
      onSearchValueChanged={setSearchTerm}
      onSelectionChanged={handleSelectionChanged}
      searchEnabled={true}
      searchPlaceholder={searchPlaceholder}
      searchValue={searchTerm}
      selectByClick={true}
      selectedItemKeys={selectedExercisesIds}
      selectionMode="multiple"
      showSelectionControls={true}
      itemTemplate={({ itemData: exercise }) => (
        <ExerciseListItem exercise={exercise} />
      )}
    />
  );
};
