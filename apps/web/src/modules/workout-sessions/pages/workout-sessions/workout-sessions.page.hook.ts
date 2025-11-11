import type { CalendarSelectionChangedEvent } from "@/web/components/ui";

import { useCallback, useMemo, useState } from "react";
import { useWorkoutSessionsQuery } from "@/web/modules/workout-sessions/hooks/queries/use-workout-sessions.query";

export function useWorkoutSessions() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Extract year and month from selected date for query
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();

  // Fetch workout sessions using React Query
  const { data: workoutSessions = [], isLoading, isError } = useWorkoutSessionsQuery(year, month);

  // Convert workout sessions to event dates
  const eventDates = useMemo(
    () =>
      workoutSessions
        .filter(session => session.completedAt)
        .map(session => new Date(session.completedAt!)),
    [workoutSessions],
  );

  // Handle date selection (local state only, no refetch)
  const handleDateSelection = useCallback((e: CalendarSelectionChangedEvent) => {
    if (e.selectedDates.length > 0) {
      setSelectedDate(e.selectedDates[0]);
    }
  }, []);

  // Find session for selected date
  const selectedDateSession = useMemo(() => {
    return workoutSessions.find((session) => {
      if (!session.completedAt) {
        return false;
      }

      const sessionDate = new Date(session.completedAt);
      return (
        sessionDate.getFullYear() === selectedDate.getFullYear()
        && sessionDate.getMonth() === selectedDate.getMonth()
        && sessionDate.getDate() === selectedDate.getDate()
      );
    });
  }, [workoutSessions, selectedDate]);

  return {
    // Data
    isLoading,
    isError,
    selectedDate,
    workoutSessions,
    eventDates,
    selectedDateSession,

    // Actions
    handleDateSelection,
  };
}
