import { Navigate, Outlet } from "@tanstack/react-router";

import { AppFallback } from "@/web/components/ui";
import { useSession } from "@/web/lib/auth";

export const PrivateRouteGuard = ({ redirectTo = "/login" }: { redirectTo?: string }) => {
  const { data: user, isPending } = useSession();

  if (isPending) {
    return <AppFallback />;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
