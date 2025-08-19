import { useState } from "react";

import type { SelectionChangedEvent } from "@/web/components/ui/list/list.types";
import type { Exercise } from "@/web/modules/workouts/types";

import { List } from "@/web/components/ui";
import { useDebounce } from "@/web/hooks";
import { useInfiniteExercisesQuery } from "@/web/modules/workouts/hooks/queries/use-exercises.query";

import { ExerciseListItem } from "./exercise-list-item";

type ExerciseSelectionListProps = {
  selectedExerciseIds?: number[];
  onSelectionChanged: (exercises: Exercise[]) => void;
  title?: string;
  searchPlaceholder?: string;
};

export const ExerciseSelectionList = ({
  selectedExerciseIds,
  onSelectionChanged,
  title = "Available exercises",
  searchPlaceholder = "Search exercises by name or muscle group...",
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
  const allExercises = data?.pages.flatMap(page => page.data ?? []) || [];

  const handleSelectionChanged = (e: SelectionChangedEvent<Exercise>) => {
    onSelectionChanged?.(e.selectedItems);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 text-center items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">Loading exercises...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Error loading exercises</h3>
        <p className="text-muted-foreground">There was an error loading exercises. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <List
        dataSource={allExercises}
        hasNextPage={hasNextPage}
        height="400px"
        infiniteScrollEnabled={true}
        isFetchingNextPage={isFetchingNextPage}
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
        selectedItemKeys={selectedExerciseIds}
        selectionMode="multiple"
        showSelectionControls={true}
        title={`${title} (${totalCount} total)`}
        itemTemplate={({ itemData: exercise }) => (
          <ExerciseListItem exercise={exercise} />
        )}
      />
    </div>
  );
};
