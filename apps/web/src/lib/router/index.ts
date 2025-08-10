import { createRouter } from "@tanstack/react-router";

import { rootRoute } from "@/web/lib/router/__root";
import { routes as authRoutes } from "@/web/modules/auth/auth.routes";
import { routes as landingRoutes } from "@/web/modules/landing/landing.routes";
// import { routes as calendarRoutes } from "@/web/modules/calendar/routes";
// import { routes as workoutsRoutes } from "@/web/modules/workouts/routes";

const routeTree = rootRoute.addChildren([
  ...landingRoutes,
  ...authRoutes,
  // ...calendarRoutes,
  // ...workoutsRoutes,
]);

export const router = createRouter({ routeTree });
