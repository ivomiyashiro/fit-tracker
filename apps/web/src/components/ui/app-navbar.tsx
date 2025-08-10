import { useLocation, useNavigate } from "@tanstack/react-router";
import { CalendarIcon, DumbbellIcon, LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/web/components/ui";
import { signOut } from "@/web/lib/auth";
import { cn } from "@/web/lib/cn";
import { useTheme } from "@/web/lib/theme/use-theme";

const NavbarItem = ({
  icon,
  path,
  onClick,
}: {
  icon: React.ReactNode;
  path?: string;
  onClick: () => void;
}) => {
  const { pathname } = useLocation();
  const isActive = pathname === path || (path && pathname.startsWith(path) && path !== "/");

  return (
    <li
      onClick={onClick}
      className={cn(
        isActive && "text-primary bg-primary/10 rounded-full",
        "p-3 cursor-pointer transition-colors duration-200",
      )}
    >
      {icon}
    </li>
  );
};

export const AppNavbar = () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed bottom-4 left-0 right-0 bg-background border mx-4 rounded-full p-2 sm:max-w-md sm:mx-auto">
      <ul className="flex justify-between items-center">
        <NavbarItem
          icon={<DumbbellIcon />}
          path="/workouts"
          onClick={() => navigate({ to: "/workouts" })}
        />
        <NavbarItem
          icon={<CalendarIcon />}
          path="/calendar"
          onClick={() => navigate({ to: "/calendar" })}
        />
        <NavbarItem
          icon={theme === "dark" ? <SunIcon /> : <MoonIcon />}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        <NavbarItem icon={<LogOutIcon />} path="/logout" onClick={() => setOpen(true)} />
      </ul>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">
              Are you sure you want to logout?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between">
            <AlertDialogCancel onClick={() => signOut()}>
              <LogOutIcon />
              Logout
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => setOpen(false)}>Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};
