import { createRoute } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader } from "@/web/components/ui";
import { rootRoute } from "@/web/lib/router/routes/__root";

export const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: CalendarPage,
});

function CalendarPage() {
  return (
    <>
      <AppHeader title="Calendar" />
      <PageLayout meta={{ title: "Calendar", description: "Calendar" }}>
        <div>CalendarPage</div>
      </PageLayout>
    </>
  );
};

export default calendarRoute;
