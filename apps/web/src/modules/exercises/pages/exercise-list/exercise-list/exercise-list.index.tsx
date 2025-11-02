import type { ItemClickEvent, SelectionChangedEvent } from "@/web/components/ui/list/list.types";
import type { Exercise } from "@/web/modules/exercises/types";

import { useMemo, useState } from "react";

import { List } from "@/web/components/ui";
import { useDebounce } from "@/web/hooks";
import { useInfiniteExercisesQuery } from "@/web/modules/exercises/hooks/queries";

import { ExerciseListItemTemplate } from "./exercise-list-item-template";

type ExerciseSelectionListProps = {
  onItemClick: (e: ItemClickEvent<Exercise>) => void;
  onSelectionChanged?: (exercises: Exercise[]) => void;
  searchPlaceholder?: string;
  selectedExercises?: Exercise[];
  selectionEnabled?: boolean;
};

export const ExerciseSelectionList = ({
  onItemClick,
  onSelectionChanged,
  searchPlaceholder = "Search exercises by name or muscle group...",
  selectedExercises = [],
  selectionEnabled = false,
}: ExerciseSelectionListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isSuccess,
  } = useInfiniteExercisesQuery(debouncedSearchTerm);

  const allExercises = data?.pages.flatMap(page => page.data ?? []) || [];

  const selectedIds = useMemo(
    () => selectedExercises?.map(ex => ex.id) || [],
    [selectedExercises],
  );

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
      displayExpr="name"
      hasNextPage={hasNextPage}
      height="400px"
      infiniteScrollEnabled={true}
      isFetchingNextPage={isFetchingNextPage}
      isSuccess={isSuccess}
      keyExpr="id"
      loadingMoreText="Loading more exercises..."
      loadMoreText="Load more exercises"
      noDataText={searchTerm ? `No exercises match "${searchTerm}". Try a different search term.` : "No exercises available."}
      onItemClick={onItemClick}
      onLoadMore={fetchNextPage}
      onSearchValueChanged={setSearchTerm}
      onSelectionChanged={handleSelectionChanged}
      searchEnabled={true}
      searchPlaceholder={searchPlaceholder}
      searchValue={searchTerm}
      selectByClick={selectionEnabled}
      selectedItems={selectedExercises}
      selectedItemKeys={selectedIds}
      selectionMode={selectionEnabled ? "multiple" : "none"}
      showSelectionControls={selectionEnabled}
      itemTemplate={({ itemData: exercise }) => (
        <ExerciseListItemTemplate
          exercise={exercise}
          selectionEnabled={selectionEnabled}
        />
      )}
    />
  );
};
