import type { CalendarDayProps } from "../calendar.types";

export function CalendarDay({
  dayData,
  dayTemplate,
  onDayClick,
}: CalendarDayProps) {
  const { date, isToday, isSelected, isDisabled, hasEvent, isCurrentMonth } = dayData;

  const baseClasses = "relative flex items-center justify-center h-10 w-full text-sm transition-all cursor-pointer hover:bg-accent";

  const dayClasses = [
    baseClasses,
    !isCurrentMonth ? "text-muted-foreground/40" : "",
    isToday && !isSelected ? "bg-accent text-accent-foreground rounded-full" : "",
    isSelected ? "bg-primary text-primary-foreground font-semibold rounded-full" : "",
    isDisabled ? "opacity-40 cursor-not-allowed" : "",
    hasEvent && !isSelected ? "font-semibold" : "",
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={dayClasses}
      onClick={e => !isDisabled && onDayClick(date, e)}
      disabled={isDisabled}
      aria-selected={isSelected}
      aria-label={date.toLocaleDateString()}
    >
      {dayTemplate
        ? dayTemplate({ date, dayData })
        : (
            <>
              <span className="relative z-10">{date.getDate()}</span>
              {hasEvent && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
              )}
            </>
          )}
    </button>
  );
}
