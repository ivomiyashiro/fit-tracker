import { createRoute } from "@tanstack/react-router";

import { PublicRouteGuard } from "@/web/lib/auth/guards";
import { rootRoute } from "@/web/lib/router/__root";
import LandingPage from "@/web/modules/landing/landing.page";

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <PublicRouteGuard redirectIfAuthenticated>
      <LandingPage />
    </PublicRouteGuard>
  ),
});

export const routes = [landingRoute];
