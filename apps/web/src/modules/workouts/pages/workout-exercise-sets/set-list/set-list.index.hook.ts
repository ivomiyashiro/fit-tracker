import type { WorkoutExerciseSet } from "@/web/modules/workouts/types";

import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { useInfiniteWorkoutExerciseSetsQuery } from "@/web/modules/workouts/hooks/queries/use-infinite-workout-exercise-sets.query";
import { dateFormat } from "@/web/utils/date-format";

type Props = {
  workoutId: number;
  workoutExerciseId: number;
};

export type SetWithComparison = {
  set: WorkoutExerciseSet;
  currentDaySets?: WorkoutExerciseSet[];
  previousDaySets?: WorkoutExerciseSet[];
  isFirstOfDay: boolean;
};

export const useSetList = ({
  workoutId,
  workoutExerciseId,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    isError,
    isFetching,
    isLoading,
  } = useInfiniteWorkoutExerciseSetsQuery(Number(workoutExerciseId), 10);

  const allSets = useMemo(
    () => data?.pages.flatMap(page => page.data) || [],
    [data?.pages],
  );

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSetClick = useCallback((setId: number) => {
    if (workoutId && workoutExerciseId) {
      navigate({
        to: "/workouts/$workoutId/we/$workoutExerciseId/sets/$setId",
        params: {
          workoutId: String(workoutId),
          workoutExerciseId: String(workoutExerciseId),
          setId: String(setId),
        },
      });
    }
  }, [workoutId, workoutExerciseId, navigate]);

  // Group sets by date and add comparison info
  const groupedSetsWithComparison = useMemo(() => {
    const grouped: Record<string, SetWithComparison[]> = {};
    const dateGroups: string[] = [];

    // First pass: group by date
    allSets.forEach((set) => {
      const date = dateFormat.format(new Date(set.createdAt));
      if (!grouped[date]) {
        grouped[date] = [];
        dateGroups.push(date);
      }
      grouped[date].push({
        set,
        isFirstOfDay: false,
      });
    });

    // Second pass: mark first set of each day and add all sets from current and previous day
    dateGroups.forEach((date, dateIndex) => {
      const setsInDay = grouped[date];

      if (setsInDay.length > 0) {
        // Mark first set of the day
        setsInDay[0].isFirstOfDay = true;

        // Find previous day's sets
        if (dateIndex < dateGroups.length - 1) {
          const previousDate = dateGroups[dateIndex + 1];
          const previousDaySets = grouped[previousDate];

          if (previousDaySets && previousDaySets.length > 0) {
            // Pass all sets from current day and previous day for comparison
            setsInDay[0].currentDaySets = setsInDay.map(s => s.set);
            setsInDay[0].previousDaySets = previousDaySets.map(s => s.set);
          }
        }
      }
    });

    return grouped;
  }, [allSets]);

  return {
    // UI state
    containerRef,
    observerRef,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    isError,
    isLoading: isLoading || isFetching || isFetchingNextPage,

    // Data
    allSets,
    groupedSets: groupedSetsWithComparison,

    // Actions
    handleSetClick,
  };
};
