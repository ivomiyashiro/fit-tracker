import type { Session, User } from "better-auth";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import ErrorPage from "@/web/modules/error/error.page";
import NotFoundPage from "@/web/modules/not-found/not-found.page";

type RootRouteContext = {
  auth: {
    user: User | null;
    session: Session | null;
  } | null;
};

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <main>
      <Outlet />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </main>
  ),
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
});
