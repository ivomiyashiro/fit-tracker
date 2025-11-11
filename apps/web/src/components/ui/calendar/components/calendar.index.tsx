import type { CalendarDay, CalendarProps } from "../calendar.types";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button, Card } from "@/web/components/ui";

import { CalendarHeader, DayNamesHeader, MonthView, WeekView } from ".";
import {
  formatDateKey,
  getMonthDays,
  getWeeksRange,
  isDateDisabled,
  isDateInArray,
  isSameDay,
  isToday,
  normalizeDate,
} from "../calendar.utils";
import { useCalendarExpanded, useCalendarSelection, useCalendarSwipe } from "../hooks";

export const Calendar = ({
  // Core Props
  value,
  defaultValue,
  disabled = false,
  visible = true,

  // Selection Props
  selectionMode = "single",
  minDate,
  maxDate,
  disabledDates = [],

  // Display Props
  showMonthView = true,
  defaultExpanded = false,
  locale,
  dayTemplate,

  // Event indicators
  eventDates = [],
  eventColors,

  // Event Handlers
  onValueChanged,
  onDayClick,
  onMonthChanged,
  onExpandedChanged,
}: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (value) {
      return normalizeDate(Array.isArray(value) ? value[0] : value);
    }
    if (defaultValue) {
      return normalizeDate(Array.isArray(defaultValue) ? defaultValue[0] : defaultValue);
    }
    return normalizeDate(new Date());
  });

  const { isExpanded, toggleExpanded } = useCalendarExpanded(defaultExpanded);

  const { handleDateSelection, isDateSelected } = useCalendarSelection(
    selectionMode,
    value,
    disabled,
    onValueChanged,
  );

  const {
    isAnimating,
    translateX,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    goToNextWeek,
    goToPreviousWeek,
  } = useCalendarSwipe(currentDate, setCurrentDate);

  // Update current date when value changes externally
  useEffect(() => {
    if (value) {
      const newDate = Array.isArray(value) ? value[0] : value;
      if (!isSameDay(newDate, currentDate)) {
        setCurrentDate(normalizeDate(newDate));
      }
    }
  }, [value, currentDate]);

  // Notify month changes
  useEffect(() => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    onMonthChanged?.({
      currentDate,
      month,
      year,
    });
  }, [currentDate, onMonthChanged]);

  // Notify expanded changes
  useEffect(() => {
    onExpandedChanged?.(isExpanded);
  }, [isExpanded, onExpandedChanged]);

  // Get 3 weeks (previous, current, next) - 21 days total
  const allWeeks = useMemo(() => {
    const weeks = getWeeksRange(currentDate, 3); // Returns 3 weeks as 2D array
    return weeks.map(weekDays =>
      weekDays.map((date): CalendarDay => {
        const dateKey = formatDateKey(date);
        return {
          date,
          isCurrentMonth: date.getMonth() === currentDate.getMonth(),
          isToday: isToday(date),
          isSelected: isDateSelected(date),
          isDisabled: isDateDisabled(date, minDate, maxDate, disabledDates),
          hasEvent: isDateInArray(date, eventDates),
          eventColor: eventColors?.get(dateKey),
        };
      }),
    );
  }, [currentDate, isDateSelected, minDate, maxDate, disabledDates, eventDates, eventColors]);

  // Get month days (all days in the month)
  const monthWeeks = useMemo(() => getMonthDays(currentDate), [currentDate]);

  const monthDays = useMemo(() => {
    return monthWeeks.flat().map((date): CalendarDay => {
      const dateKey = formatDateKey(date);
      return {
        date,
        isCurrentMonth: date.getMonth() === currentDate.getMonth(),
        isToday: isToday(date),
        isSelected: isDateSelected(date),
        isDisabled: isDateDisabled(date, minDate, maxDate, disabledDates),
        hasEvent: isDateInArray(date, eventDates),
        eventColor: eventColors?.get(dateKey),
      };
    });
  }, [monthWeeks, currentDate, isDateSelected, minDate, maxDate, disabledDates, eventDates, eventColors]);

  const handleDayClick = useCallback((date: Date, event: React.MouseEvent) => {
    if (disabled)
return;

    const dayData = (isExpanded ? monthDays : allWeeks.flat()).find(d => isSameDay(d.date, date));
    if (!dayData || dayData.isDisabled)
return;

    handleDateSelection(date);

    onDayClick?.({
      date,
      dayData,
      event,
    });
  }, [disabled, isExpanded, monthDays, allWeeks, handleDateSelection, onDayClick]);

  const handleToggleExpanded = useCallback(() => {
    if (!showMonthView)
return;
    toggleExpanded();
  }, [showMonthView, toggleExpanded]);

  if (!visible)
return null;

  return (
    <Card className="w-full p-4">
        <CalendarHeader
          currentDate={currentDate}
          locale={locale}
          showNavigation={!isExpanded}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
        />
        <DayNamesHeader locale={locale} />
        <div className={`transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[500px]" : "max-h-[48px]"} overflow-hidden`}>
          {isExpanded
? (
            <MonthView
              monthWeeks={monthWeeks}
              monthDays={monthDays}
              dayTemplate={dayTemplate}
              onDayClick={handleDayClick}
            />
          )
: (
            <WeekView
              allWeeks={allWeeks}
              translateX={translateX}
              isAnimating={isAnimating}
              dayTemplate={dayTemplate}
              onDayClick={handleDayClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          )}
        </div>

        {showMonthView && (
          <div className="flex justify-center mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleExpanded}
              disabled={disabled}
              className="gap-1"
            >
              {isExpanded
? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span className="text-xs">Show less</span>
                </>
              )
: (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span className="text-xs">Show more</span>
                </>
              )}
            </Button>
          </div>
        )}
    </Card>
  );
};
