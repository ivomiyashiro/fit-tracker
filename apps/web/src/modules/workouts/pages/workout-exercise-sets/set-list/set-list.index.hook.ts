import type { ItemClickEvent } from "@/web/components/ui";
import type { WorkoutExerciseSet } from "@/web/modules/workouts/types";

import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { useInfiniteWorkoutExerciseSetsQuery } from "@/web/modules/workouts/hooks/queries/use-infinite-workout-exercise-sets.query";
import { dateFormat } from "@/web/utils/date-format";

type Props = {
  workoutId: number;
  workoutExerciseId: number;
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

  const allSets = data?.pages.flatMap(page => page.data) || [];

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

  const handleSetClick = (e: ItemClickEvent<WorkoutExerciseSet>) => {
    const set = e.item;
    if (workoutId && workoutExerciseId) {
      navigate({
        to: "/workouts/$workoutId/we/$workoutExerciseId/sets/$setId",
        params: {
          workoutId: String(workoutId),
          workoutExerciseId: String(workoutExerciseId),
          setId: String(set.id),
        },
      });
    }
  };

  // Group sets by date
  const groupedSets = allSets.reduce((acc: Record<string, WorkoutExerciseSet[]>, set: WorkoutExerciseSet) => {
    const date = dateFormat.format(new Date(set.createdAt));
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(set);
    return acc;
  }, {});

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
    groupedSets,

    // Actions
    handleSetClick,
  };
};
