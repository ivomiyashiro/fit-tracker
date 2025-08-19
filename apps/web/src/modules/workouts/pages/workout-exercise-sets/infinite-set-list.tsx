import { useEffect, useRef } from "react";

import type { WorkoutExerciseSet } from "@/web/modules/workouts/types";

import { SetList } from "./set-list";

type InfiniteSetListProps = {
  isLoading: boolean;
  isError: boolean;
  allSets: WorkoutExerciseSet[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  workoutId?: number;
  workoutExerciseId?: number;
};

// Helper function to group sets by date
const groupSetsByDate = (sets: WorkoutExerciseSet[]): Record<string, WorkoutExerciseSet[]> => {
  return sets.reduce((acc: Record<string, WorkoutExerciseSet[]>, set: WorkoutExerciseSet) => {
    const date = new Date(set.createdAt).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(set);
    return acc;
  }, {});
};

export const InfiniteSetList = ({
  allSets,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  isLoading,
  workoutId,
  workoutExerciseId,
}: InfiniteSetListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading && allSets.length === 0) {
    return (
      <div className="flex flex-col gap-2 text-center items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">Loading sets...</p>
      </div>
    );
  }

  if (allSets.length === 0) {
    return (
      <div className="flex flex-col gap-2 text-center items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No sets recorded yet</p>
      </div>
    );
  }

  // Group sets by date
  const groupedSets = groupSetsByDate(allSets);

  return (
    <div ref={containerRef} className="flex flex-col gap-8">
      {Object.entries(groupedSets).map(([date, sets]) => (
        <div key={date} className="flex flex-col gap-2">
          <span className="text-sm font-semibold px-3 text-muted-foreground">
            {date}
          </span>
          <SetList
            sets={sets}
            workoutId={workoutId}
            workoutExerciseId={workoutExerciseId}
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
