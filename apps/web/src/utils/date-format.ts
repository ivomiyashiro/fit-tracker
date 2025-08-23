export const dateFormat = new Intl.DateTimeFormat(navigator.language, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const timeFormat = new Intl.DateTimeFormat(navigator.language, {
  hour: "2-digit",
  minute: "2-digit",
});
