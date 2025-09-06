import { createRouter } from "@tanstack/react-router";
import { lazy } from "react";

import { routeTree } from "./route-tree.gen";

export const router = createRouter({
  routeTree,
  context: {
    auth: null,
  },
  defaultPendingComponent: () => {
    const AppFallback = lazy(() =>
      import("@/web/components/ui").then(mod => ({
        default: mod.AppFallback,
      })),
    );

    return <AppFallback />;
  },
});

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}
