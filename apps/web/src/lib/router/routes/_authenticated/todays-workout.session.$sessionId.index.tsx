import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import ActiveSessionPage from "@/web/modules/todays-workout/pages/active-session/active-session.page";

const searchSchema = z.object({
  exerciseIndex: z.number().optional().default(0),
});

export const Route = createFileRoute(
  "/_authenticated/todays-workout/session/$sessionId/",
)({
  component: ActiveSessionPage,
  validateSearch: searchSchema,
});
