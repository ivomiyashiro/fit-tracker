import { createFileRoute, redirect } from "@tanstack/react-router";

import { AppLayout } from "@/web/components/layouts/app.layout";

export const Route = createFileRoute("/_authenticated")({
  component: AppLayout,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.user) {
      throw redirect({
        to: "/auth/sign-in",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
