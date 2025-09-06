import { createFileRoute } from "@tanstack/react-router";

import NotFoundPage from "@/web/modules/not-found/not-found.page";

export const Route = createFileRoute("/404")({
  component: NotFoundPage,
});
