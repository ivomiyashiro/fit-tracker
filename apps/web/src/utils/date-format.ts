// Format date as "Mon, 14 jul 2025" based on browser language
export const dateFormat = new Intl.DateTimeFormat(
  typeof navigator !== "undefined" ? navigator.language : "en-US",
  {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
);

export const timeFormat = new Intl.DateTimeFormat(navigator.language, {
  hour: "2-digit",
  minute: "2-digit",
});
