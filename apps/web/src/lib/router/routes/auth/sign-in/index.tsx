import { createFileRoute, redirect } from "@tanstack/react-router";

import LoginPage from "@/web/modules/auth/pages/login.page";

export const Route = createFileRoute("/auth/sign-in/")({
  beforeLoad: async ({ context }) => {
    if (context.auth?.user) {
      throw redirect({
        to: "/workouts",
      });
    }
  },
  component: LoginPage,
});
