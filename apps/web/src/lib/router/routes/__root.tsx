import type { Session, User } from "better-auth";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

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
      <TanStackRouterDevtools />
    </main>
  ),
});
