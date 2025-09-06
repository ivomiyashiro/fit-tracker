import { createFileRoute } from "@tanstack/react-router";

import LandingPage from "@/web/modules/landing/landing.page";

export const Route = createFileRoute("/_public/")({
  component: LandingPage,
});
