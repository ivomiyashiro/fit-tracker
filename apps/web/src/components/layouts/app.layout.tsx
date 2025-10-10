import { Outlet } from "@tanstack/react-router";

import { AppNavbar } from "@/web/components/ui";

type Props = {
  children?: React.ReactNode;
};

export const AppLayout = ({ children }: Props) => {
  return (
    <div className="grid h-screen grid-rows-[1fr_auto]">
      <div className="overflow-auto ">
        {children ?? <Outlet />}
      </div>
      <div className="relative py-3">
        <div className="absolute inset-x-0 -top-3 h-4 bg-gradient-to-b from-transparent to-background" />
        <AppNavbar />
      </div>
    </div>
  );
};
