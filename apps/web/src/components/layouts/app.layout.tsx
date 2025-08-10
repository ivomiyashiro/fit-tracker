import { Outlet } from "@tanstack/react-router";
import { AppFallback, AppNavbar } from "@/web/components/ui";
import { useExercisesQuery } from "@/web/modules/exercises/hooks";

type AppLayoutProps = {
  children?: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { isLoading: isExercisesLoading } = useExercisesQuery();

  if (isExercisesLoading) {
    return <AppFallback />;
  }

  return (
    <>
      {children ?? <Outlet />}
      <AppNavbar />
    </>
  );
};
