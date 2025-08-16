import { createRoute } from "@tanstack/react-router";

import { AppLayout } from "@/web/components/layouts/app.layout";
import { PrivateRouteGuard } from "@/web/lib/auth/guards";
import { rootRoute } from "@/web/lib/router/routes/__root";
import CalendarPage from "@/web/modules/calendar/calendar.page";

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: CalendarPage,
});

export const routes = [calendarRoute];
