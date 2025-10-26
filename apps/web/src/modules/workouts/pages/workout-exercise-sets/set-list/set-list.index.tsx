import { useCallback } from "react";

import { List } from "@/web/components/ui";
import { SetListItem } from "./set-list-item";
import { SetListItemCompared } from "./set-list-item-compared";
import { SetListSkeleton } from "./set-list-skeleton";
import { useSetList } from "./set-list.index.hook";

type Props = {
  workoutId: number;
  workoutExerciseId: number;
};

export const InfiniteSetList = ({
  workoutId,
  workoutExerciseId,
}: Props) => {
  const {
    // UI state
    containerRef,
    observerRef,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,

    // Data
    allSets,
    groupedSets,

    // Actions
    handleSetClick,
  } = useSetList({
    workoutId,
    workoutExerciseId,
  });

  const renderSetItem = useCallback(({ itemData }: { itemData: any }) => (
    <div className="flex flex-col gap-3">
      {itemData.isFirstOfDay && itemData.previousSet && (
        <SetListItemCompared
          set={itemData.set}
          previousSet={itemData.previousSet}
        />
      )}
      <SetListItem
        set={itemData.set}
        onClick={() => handleSetClick(itemData.set.id)}
      />
    </div>
  ), [handleSetClick]);

  if (isError) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Error loading sets</h3>
        <p className="text-muted-foreground">There was an error loading sets. Please try again.</p>
      </div>
    );
  }

  if (isLoading && allSets.length === 0) {
    return <SetListSkeleton />;
  }

  if (allSets.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">No sets recorded yet</h3>
        <p className="text-muted-foreground">Add your first set to get started!</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex flex-col gap-8">
      {Object.entries(groupedSets).map(([date, setsWithComparison]) => (
        <div key={date} className="flex flex-col gap-2">
          <span className="text-xs font-semibold px-3 text-muted-foreground">
            {date}
          </span>
          <List
            dataSource={setsWithComparison}
            isSuccess={!isLoading}
            keyExpr={item => item.set.id}
            itemTemplate={renderSetItem}
          />
        </div>
      ))}

      {/* Intersection observer target */}
      {hasNextPage && (
        <div
          ref={observerRef}
          className="flex items-center justify-center py-4"
        >
          {isFetchingNextPage
            ? (
                <div className="text-sm text-muted-foreground">Loading more sets...</div>
              )
            : (
                <div className="text-sm text-muted-foreground">Scroll to load more</div>
              )}
        </div>
      )}
    </div>
  );
};
