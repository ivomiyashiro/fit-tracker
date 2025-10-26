import { useLocation, useNavigate } from "@tanstack/react-router";
import { CalendarIcon, DumbbellIcon, LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/web/components/ui";
import { signOut } from "@/web/lib/auth";
import { cn } from "@/web/lib/cn";
import { useTheme } from "@/web/lib/theme/use-theme";

type Props = {
  icon: React.ReactNode;
  path?: string;
  onClick: () => void;
};

const NavbarItem = ({ icon, path, onClick }: Props) => {
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

  const handleLogout = () => {
    setOpen(false);
    signOut();
    navigate({ to: "/", reloadDocument: true });
  };

  return (
    <nav className="bg-background border rounded-full mx-4 p-2 sm:max-w-md sm:mx-auto">
      <ul className="flex justify-between items-center">
        <NavbarItem
          icon={<DumbbellIcon className="w-5 h-5" />}
          path="/workouts"
          onClick={() => navigate({ to: "/workouts" })}
        />
        <NavbarItem
          icon={<CalendarIcon className="w-5 h-5" />}
          path="/calendar"
          onClick={() => navigate({ to: "/" })}
        />
        <NavbarItem
          icon={theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        <NavbarItem
          icon={<LogOutIcon className="w-5 h-5" />}
          path="/logout"
          onClick={() => {
          // Blur any focused element before opening dialog to prevent aria-hidden conflict
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          setOpen(true);
        }}
        />
      </ul>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="max-w-xs">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left">
              Are you sure you want to logout?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              You will need to sign in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between">
            <AlertDialogCancel onClick={handleLogout}>
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
