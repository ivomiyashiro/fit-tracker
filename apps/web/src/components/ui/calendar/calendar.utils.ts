/**
 * Format date to YYYY-MM-DD string for comparison
 */
export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear()
    && date1.getMonth() === date2.getMonth()
    && date1.getDate() === date2.getDate()
  );
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Get 7 days starting from a given date
 */
export function getWeekDays(startDate: Date): Date[] {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }
  return days;
}

/**
 * Get multiple weeks (3 weeks by default: previous, current, next)
 * Returns a 2D array where each sub-array is a week with 7 days
 */
export function getWeeksRange(centerDate: Date, weeksCount: number = 3): Date[][] {
  const startOfWeek = getStartOfWeek(centerDate);
  const middleWeekIndex = Math.floor(weeksCount / 2);
  const weeks: Date[][] = [];

  for (let weekOffset = -middleWeekIndex; weekOffset <= middleWeekIndex; weekOffset++) {
    const weekStartDate = addWeeks(startOfWeek, weekOffset);
    const weekDays = getWeekDays(weekStartDate);
    weeks.push(weekDays);
  }

  return weeks;
}

/**
 * Get all days in a month as a 2D array (weeks)
 */
export function getMonthDays(date: Date): Date[][] {
  const year = date.getFullYear();
  const month = date.getMonth();

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  // Adjust so Monday = 0
  let firstDayOfWeek = firstDay.getDay() - 1;
  if (firstDayOfWeek < 0)
firstDayOfWeek = 6;

  const days: Date[][] = [];
  let currentWeek: Date[] = [];

  // Fill in previous month's days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    currentWeek.push(date);
  }

  // Fill in current month's days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    if (currentWeek.length === 7) {
      days.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(new Date(year, month, day));
  }

  // Fill in next month's days
  let nextMonthDay = 1;
  while (currentWeek.length < 7) {
    currentWeek.push(new Date(year, month + 1, nextMonthDay));
    nextMonthDay++;
  }
  days.push(currentWeek);

  return days;
}

/**
 * Get day names for header (single letter)
 */
export function getDayNames(locale: string = "default"): string[] {
  const baseDate = new Date(2024, 0, 1); // January 1, 2024 (Monday)
  const days: string[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + i);
    const dayName = date.toLocaleDateString(locale, { weekday: "narrow" });
    days.push(dayName);
  }

  return days;
}

/**
 * Get month name
 */
export function getMonthName(date: Date, locale: string = "default"): string {
  return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
}

/**
 * Check if a date is in an array of dates
 */
export function isDateInArray(date: Date, dates: Date[]): boolean {
  return dates.some(d => isSameDay(d, date));
}

/**
 * Check if a date is disabled
 */
export function isDateDisabled(
  date: Date,
  minDate?: Date,
  maxDate?: Date,
  disabledDates?: Date[],
): boolean {
  if (minDate && date < minDate)
return true;
  if (maxDate && date > maxDate)
return true;
  if (disabledDates && isDateInArray(date, disabledDates))
return true;
  return false;
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add weeks to a date
 */
export function addWeeks(date: Date, weeks: number): Date {
  return addDays(date, weeks * 7);
}

/**
 * Get start of week (Monday)
 */
export function getStartOfWeek(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust when day is Sunday
  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Normalize date to start of day
 */
export function normalizeDate(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}
