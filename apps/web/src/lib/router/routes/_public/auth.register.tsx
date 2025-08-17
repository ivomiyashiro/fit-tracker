import { createFileRoute } from "@tanstack/react-router";

import RegisterPage from "@/web/modules/auth/pages/register.page";

export const Route = createFileRoute("/_public/auth/register")({
  component: RegisterPage,
});
