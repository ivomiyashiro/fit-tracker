import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/web/components/ui";

import { getMonthName } from "../calendar.utils";

type CalendarHeaderProps = {
  currentDate: Date;
  locale?: string;
  showNavigation?: boolean;
  onPreviousWeek?: () => void;
  onNextWeek?: () => void;
};

export function CalendarHeader({
  currentDate,
  locale = "default",
  showNavigation = true,
  onPreviousWeek,
  onNextWeek,
}: CalendarHeaderProps) {
  const monthName = getMonthName(currentDate, locale);

  return (
    <div className="flex items-center justify-between mb-2">
      {showNavigation && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onPreviousWeek}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      <h2 className="text-lg font-semibold capitalize">
        {monthName}
      </h2>
      {showNavigation && (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onNextWeek}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
