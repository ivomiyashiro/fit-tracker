import type { CalendarSelectionChangedEvent } from "@/web/components/ui";
import { Calendar } from "@/web/components/ui";

type WorkoutSessionCalendarProps = {
  selectedDate: Date;
  eventDates: Date[];
  isLoading: boolean;
  isError: boolean;
  onDateSelection: (e: CalendarSelectionChangedEvent) => void;
};

export function WorkoutSessionCalendar({
  selectedDate,
  eventDates,
  isLoading,
  isError,
  onDateSelection,
}: WorkoutSessionCalendarProps) {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Cargando calendario...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error al cargar el calendario</p>
      </div>
    );
  }

  return (
    <Calendar
      value={selectedDate}
      selectionMode="single"
      eventDates={eventDates}
      onValueChanged={onDateSelection}
    />
  );
}
