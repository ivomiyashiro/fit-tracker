import { createFileRoute } from "@tanstack/react-router";

import SignInPage from "@/web/modules/auth/pages/sign-in.page";

export const Route = createFileRoute("/_public/auth/sign-in")({
  component: SignInPage,
});
