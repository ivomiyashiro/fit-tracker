import type { GetExercisesResponse } from "@fit-tracker/api-client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { EmptyState, Label, ListContainer, ListItem, SearchInput } from "@/web/components/ui";
import { useCachedOrExercisesQuery } from "@/web/modules/exercises/hooks/use-exercises.query";

const NoSearchResults = ({ searchTerm }: { searchTerm: string }) => {
  return (
    <div className="flex flex-col gap-2 text-center items-center justify-center py-8">
      <p className="text-lg font-medium">No exercises found</p>
      <p className="text-sm text-muted-foreground">
        No exercises match "
        {searchTerm}
        ". Try a different search term.
      </p>
    </div>
  );
};

const ExerciseItem = ({
  exercise,
  isSelected,
  onToggle,
  isAlreadyInWorkout,
}: {
  exercise: GetExercisesResponse[number];
  isSelected: boolean;
  onToggle: (exercise: GetExercisesResponse[number]) => void;
  isAlreadyInWorkout: boolean;
}) => {
  const handleToggle = () => {
    if (!isAlreadyInWorkout) {
      onToggle(exercise);
    }
  };

  return (
    <ListItem
      selectionEnabled
      isSelected={isSelected}
      onToggle={handleToggle}
      disabled={isAlreadyInWorkout}
    >
      <div className="flex-1">
        <p className="font-medium">
          {exercise.name}
          {isAlreadyInWorkout && " (Already in workout)"}
        </p>
        {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {exercise.muscleGroups.map(mg => mg.name).join(", ")}
          </p>
        )}
      </div>
    </ListItem>
  );
};

const VirtualizedExerciseList = ({
  exercises,
  selectedExercises,
  toggleSelection,
  isExerciseInWorkout,
}: {
  exercises: GetExercisesResponse;
  selectedExercises: GetExercisesResponse[number][];
  toggleSelection: (exercise: GetExercisesResponse[number]) => void;
  isExerciseInWorkout: (exerciseId: number) => boolean;
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 60; // Approximate height of each exercise item

  const handleScroll = useCallback(() => {
    if (!containerRef.current)
      return;

    const { scrollTop, clientHeight } = containerRef.current;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    const newEndIndex = Math.min(
      newStartIndex + Math.ceil(clientHeight / itemHeight) + 5, // Add buffer
      exercises.length,
    );

    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
  }, [exercises.length, itemHeight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container)
      return;

    container.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const visibleExercises = exercises.slice(startIndex, endIndex);
  const totalHeight = exercises.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return (
    <div ref={containerRef} className="max-h-[400px] overflow-y-auto" style={{ height: "400px" }}>
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          <ul>
            {visibleExercises.map(exercise => (
              <div key={exercise.id} style={{ height: itemHeight }}>
                <ExerciseItem
                  exercise={exercise}
                  isSelected={selectedExercises.includes(exercise)}
                  onToggle={toggleSelection}
                  isAlreadyInWorkout={isExerciseInWorkout(exercise.id)}
                />
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const ExerciseSelectionList = ({
  selectedExercises,
  toggleSelection,
  isExerciseInWorkout,
}: {
  selectedExercises: GetExercisesResponse[number][];
  toggleSelection: (exercise: GetExercisesResponse[number]) => void;
  isExerciseInWorkout: (exerciseId: number) => boolean;
}) => {
  const { data: exercises = [] } = useCachedOrExercisesQuery();

  const [searchTerm, setSearchTerm] = useState("");

  const filteredExercises = useMemo(() => {
    if (!searchTerm.trim()) {
      return exercises;
    }

    const searchLower = searchTerm.toLowerCase();
    return exercises.filter((exercise) => {
      const nameMatch = exercise.name.toLowerCase().includes(searchLower);

      const muscleGroupMatch
        = exercise.muscleGroups?.some(mg => mg.name.toLowerCase().includes(searchLower)) || false;

      return nameMatch || muscleGroupMatch;
    });
  }, [exercises, searchTerm]);

  if (exercises.length === 0) {
    return (
      <EmptyState
        title="Oops! No exercises found"
        description="No exercises are available to add to this workout."
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="px-3">
        <Label>
          Available exercises (
          {exercises.length}
          {" "}
          total)
        </Label>
      </div>

      <SearchInput
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search exercises by name or muscle group..."
      />

      <ListContainer>
        {filteredExercises.length === 0
          ? (
              <NoSearchResults searchTerm={searchTerm} />
            )
          : filteredExercises.length > 50
            ? (
                <VirtualizedExerciseList
                  exercises={filteredExercises}
                  selectedExercises={selectedExercises}
                  toggleSelection={toggleSelection}
                  isExerciseInWorkout={isExerciseInWorkout}
                />
              )
            : (
                <div className="max-h-[400px] overflow-y-auto">
                  <ul>
                    {filteredExercises.map(exercise => (
                      <ExerciseItem
                        key={exercise.id}
                        exercise={exercise}
                        isSelected={selectedExercises.includes(exercise)}
                        onToggle={toggleSelection}
                        isAlreadyInWorkout={isExerciseInWorkout(exercise.id)}
                      />
                    ))}
                  </ul>
                </div>
              )}
      </ListContainer>
    </div>
  );
};
