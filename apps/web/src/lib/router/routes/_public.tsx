import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
  beforeLoad: ({ context }) => {
    if (context.auth?.user) {
      throw redirect({
        to: "/workouts",
      });
    }
  },
});

function PublicLayout() {
  return <Outlet />;
}
