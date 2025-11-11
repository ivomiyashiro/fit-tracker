import type { CalendarSelectionChangedEvent } from "../calendar.types";

import { useCallback, useEffect, useRef, useState } from "react";

import { isSameDay, normalizeDate } from "../calendar.utils";

export function useCalendarSelection(
  selectionMode: "single" | "multiple" | "none",
  value?: Date | Date[],
  disabled?: boolean,
  onValueChanged?: (e: CalendarSelectionChangedEvent) => void,
) {
  const [selectedDates, setSelectedDates] = useState<Date[]>(() => {
    if (!value)
return [];
    return Array.isArray(value) ? value.map(normalizeDate) : [normalizeDate(value)];
  });

  const pendingChangeRef = useRef<CalendarSelectionChangedEvent | null>(null);

  // Sync with external value prop
  useEffect(() => {
    if (!value) {
      setSelectedDates([]);
      return;
    }

    const newDates = Array.isArray(value) ? value.map(normalizeDate) : [normalizeDate(value)];
    setSelectedDates(newDates);
  }, [value]);

  // Notify parent of selection changes after state update
  useEffect(() => {
    if (pendingChangeRef.current) {
      onValueChanged?.(pendingChangeRef.current);
      pendingChangeRef.current = null;
    }
  }, [selectedDates, onValueChanged]);

  const handleDateSelection = useCallback((date: Date) => {
    if (disabled || selectionMode === "none")
return;

    const normalizedDate = normalizeDate(date);

    setSelectedDates((prevDates) => {
      let newDates: Date[];
      let addedDates: Date[] = [];
      let removedDates: Date[] = [];

      if (selectionMode === "single") {
        newDates = [normalizedDate];
        addedDates = [normalizedDate];
        removedDates = prevDates;
      }
      else {
        // Multiple selection
        const isSelected = prevDates.some(d => isSameDay(d, normalizedDate));
        if (isSelected) {
          newDates = prevDates.filter(d => !isSameDay(d, normalizedDate));
          removedDates = [normalizedDate];
        }
        else {
          newDates = [...prevDates, normalizedDate];
          addedDates = [normalizedDate];
        }
      }

      // Store the change event to be dispatched after state update
      pendingChangeRef.current = {
        selectedDates: newDates,
        addedDates,
        removedDates,
      };

      return newDates;
    });
  }, [disabled, selectionMode]);

  const isDateSelected = useCallback((date: Date) => {
    return selectedDates.some(d => isSameDay(d, date));
  }, [selectedDates]);

  return {
    selectedDates,
    handleDateSelection,
    isDateSelected,
  };
}
