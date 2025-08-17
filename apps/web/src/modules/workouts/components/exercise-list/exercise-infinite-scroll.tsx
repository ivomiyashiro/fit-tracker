import type { Exercise } from "@/web/modules/workouts/types";

import { EmptyState } from "@/web/components/ui";
import { useInfiniteScroll } from "@/web/hooks";
import { ExerciseListItem } from "@/web/modules/workouts/components/exercise-list/exercise-list-item";

type InfiniteExerciseScrollProps = {
  isLoading: boolean;
  isError: boolean;
  exercises: Exercise[];
  selectedExerciseIds: number[];
  onSelectionChange: (exerciseId: number) => void;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
};

export const InfiniteExerciseScroll = ({
  exercises,
  selectedExerciseIds,
  onSelectionChange,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isLoading,
  isError,
}: InfiniteExerciseScrollProps) => {
  const itemHeight = 60;

  const {
    containerRef,
    loadMoreRef,
    visibleItems: visibleExercises,
    totalHeight,
    offsetY,
  } = useInfiniteScroll(exercises, {
    itemHeight,
    containerHeight: 400,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 text-center items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">Loading exercises...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Error loading exercises"
        description="There was an error loading exercises. Please try again."
      />
    );
  }

  return (
    <div ref={containerRef} className="max-h-[400px] overflow-y-auto" style={{ height: "400px" }}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          <ul>
            {visibleExercises.map(exercise => (
              <div key={exercise.id} style={{ height: itemHeight }}>
                <ExerciseListItem
                  exercise={exercise}
                  isSelected={selectedExerciseIds.includes(exercise.id)}
                  onSelectionChange={() => onSelectionChange(exercise.id)}
                />
              </div>
            ))}
          </ul>
        </div>
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isFetchingNextPage
              ? (
                  <div className="text-sm text-muted-foreground">Loading more...</div>
                )
              : (
                  <div className="text-sm text-muted-foreground">Scroll to load more</div>
                )}
          </div>
        )}
      </div>
    </div>
  );
};
