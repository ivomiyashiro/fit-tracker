import { Outlet } from "@tanstack/react-router";

import { AppNavbar } from "@/web/components/ui";

type Props = {
  children?: React.ReactNode;
};

export const AppLayout = ({ children }: Props) => {
  return (
    <>
      {children ?? <Outlet />}
      <AppNavbar />
    </>
  );
};
