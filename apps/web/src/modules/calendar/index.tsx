import { createRoute } from "@tanstack/react-router";

import { rootRoute } from "@/web/lib/router/routes/__root";
import CalendarPage from "@/web/modules/calendar/calendar.page";

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: CalendarPage,
});

export const routes = [calendarRoute];
