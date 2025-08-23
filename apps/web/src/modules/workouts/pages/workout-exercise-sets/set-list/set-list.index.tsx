import { List } from "@/web/components/ui";

import { SetListItem } from "./set-list-item";
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
    isSuccess,
    isError,

    // Data
    allSets,
    groupedSets,

    // Actions
    handleSetClick,
  } = useSetList({
    workoutId,
    workoutExerciseId,
  });

  if (isError) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Error loading sets</h3>
        <p className="text-muted-foreground">There was an error loading sets. Please try again.</p>
      </div>
    );
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
      {Object.entries(groupedSets).map(([date, sets]) => (
        <div key={date} className="flex flex-col gap-2">
          <span className="text-sm font-semibold px-3 text-muted-foreground">
            {date}
          </span>
          <List
            dataSource={sets}
            isSuccess={isSuccess}
            keyExpr="id"
            onItemClick={handleSetClick}
            itemTemplate={({ itemData: set }) => (
              <SetListItem set={set} />
            )}
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
