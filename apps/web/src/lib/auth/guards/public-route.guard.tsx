import { Navigate, Outlet } from "@tanstack/react-router";

import { AppFallback } from "@/web/components/ui";
import { useSession } from "@/web/lib/auth";

export const PublicRouteGuard = ({
  redirectIfAuthenticated = false,
  redirectTo = "/workouts",
  children,
}: {
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
  children?: React.ReactNode;
}) => {
  const { data: user, isPending } = useSession();

  if (isPending) {
    return <AppFallback />;
  }

  if (redirectIfAuthenticated && user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ?? <Outlet />;
};
