import { getDayNames } from "../calendar.utils";

type DayNamesHeaderProps = {
  locale?: string;
};

export function DayNamesHeader({ locale = "default" }: DayNamesHeaderProps) {
  const dayNames = getDayNames(locale);

  return (
    <div className="grid grid-cols-7 gap-1">
      {dayNames.map((day, index) => (
        <div
          key={`day-${index}`}
          className="flex items-center justify-center h-8 text-xs font-medium text-muted-foreground uppercase"
        >
          {day}
        </div>
      ))}
    </div>
  );
}
