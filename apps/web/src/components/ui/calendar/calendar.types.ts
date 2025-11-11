import type { ReactNode } from "react";

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  hasEvent?: boolean;
  eventColor?: string;
};

export type DayClickEvent = {
  date: Date;
  dayData: CalendarDay;
  event: React.MouseEvent;
};

export type CalendarSelectionChangedEvent = {
  selectedDates: Date[];
  addedDates: Date[];
  removedDates: Date[];
};

export type MonthChangedEvent = {
  currentDate: Date;
  month: number;
  year: number;
};

export type CalendarProps = {
  // Core Props
  value?: Date | Date[];
  defaultValue?: Date | Date[];
  disabled?: boolean;
  visible?: boolean;

  // Selection Props
  selectionMode?: "single" | "multiple" | "none";
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];

  // Display Props
  showMonthView?: boolean;
  defaultExpanded?: boolean;
  locale?: string;
  dayTemplate?: (params: { date: Date; dayData: CalendarDay }) => ReactNode;

  // Event indicators
  eventDates?: Date[];
  eventColors?: Map<string, string>; // dateString -> color

  // Event Handlers
  onValueChanged?: (e: CalendarSelectionChangedEvent) => void;
  onDayClick?: (e: DayClickEvent) => void;
  onMonthChanged?: (e: MonthChangedEvent) => void;
  onExpandedChanged?: (expanded: boolean) => void;
};

export type CalendarDayProps = {
  dayData: CalendarDay;
  dayTemplate?: (params: { date: Date; dayData: CalendarDay }) => ReactNode;
  onDayClick: (date: Date, event: React.MouseEvent) => void;
};
