import type { CalendarDay, CalendarDayProps } from "../calendar.types";

import { CalendarDay as CalendarDayComponent } from "./calendar-day";

type MonthViewProps = {
  monthWeeks: Date[][];
  monthDays: CalendarDay[];
  dayTemplate?: CalendarDayProps["dayTemplate"];
  onDayClick: (date: Date, event: React.MouseEvent) => void;
};

export function MonthView({
  monthWeeks,
  monthDays,
  dayTemplate,
  onDayClick,
}: MonthViewProps) {
  return (
    <div className="grid grid-cols-7 gap-1">
      {monthWeeks.flat().map((date) => {
        const dayData = monthDays.find(d => d.date.getTime() === date.getTime());
        if (!dayData) {
          return null;
        }

        return (
          <CalendarDayComponent
            key={date.toISOString()}
            dayData={dayData}
            dayTemplate={dayTemplate}
            onDayClick={onDayClick}
          />
        );
      })}
    </div>
  );
}
