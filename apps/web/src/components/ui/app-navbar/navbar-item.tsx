import { useLocation } from "@tanstack/react-router";

import { cn } from "@/web/lib/cn";

type NavbarItemProps = {
  icon: React.ReactNode;
  path?: string;
  onClick: () => void;
};

export const NavbarItem = ({ icon, path, onClick }: NavbarItemProps) => {
  const { pathname } = useLocation();
  const isActive = pathname === path || (path && pathname.startsWith(path) && path !== "/");

  return (
    <li
      onClick={onClick}
      className={cn(
        isActive && "text-primary bg-primary/20 rounded-full",
        "p-3 cursor-pointer transition-colors duration-200",
      )}
    >
      {icon}
    </li>
  );
};
