import type { SessionContext } from "@hono/auth-js/react";

import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

type Session = Parameters<typeof SessionContext>[0]["value"];

export const Route = createRootRouteWithContext<{
  session: Session;
}>()({
  component: () => (
    <>
      <main className="container" style={{ marginTop: "1rem" }}>
        <Outlet />
        <TanStackRouterDevtools />
      </main>
    </>
  ),
});
