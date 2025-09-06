import { createRouter } from "@tanstack/react-router";

import { routeTree } from "./route-tree.gen";

export const router = createRouter({
  routeTree,
  context: {
    auth: null,
  },
});

declare module "@tanstack/react-router" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Register {
    router: typeof router;
  }
}
