import { Outlet } from "@tanstack/react-router";
import { AppNavbar } from "@/web/components/ui";

type AppLayoutProps = {
  children?: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <>
      {children ?? <Outlet />}
      <AppNavbar />
    </>
  );
};
