import type { CalendarDay, CalendarDayProps } from "../calendar.types";

import { CalendarDay as CalendarDayComponent } from "./calendar-day";

type WeekViewProps = {
  allWeeks: CalendarDay[][]; // Array of 3 weeks, each with 7 days
  translateX: number; // Current horizontal translation
  isAnimating: boolean;
  dayTemplate?: CalendarDayProps["dayTemplate"];
  onDayClick: (date: Date, event: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
};

export function WeekView({
  allWeeks,
  translateX,
  isAnimating,
  dayTemplate,
  onDayClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: WeekViewProps) {
  return (
    <div
      className="overflow-hidden touch-pan-y relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="flex"
        style={{
          transform: `translateX(calc(-100% + ${translateX}px))`,
          transition: isAnimating ? "transform 300ms ease-out" : translateX === 0 ? "transform 200ms ease-out" : "none",
        }}
      >
        {allWeeks.map((weekDays, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            className="grid grid-cols-7 gap-1 min-w-full flex-shrink-0"
          >
            {weekDays.map(dayData => (
              <CalendarDayComponent
                key={dayData.date.toISOString()}
                dayData={dayData}
                dayTemplate={dayTemplate}
                onDayClick={onDayClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
