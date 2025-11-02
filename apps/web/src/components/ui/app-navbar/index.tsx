import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { signOut } from "@/web/lib/auth";

import { LogoutDialog } from "./logout-dialog";
import { NavbarItem } from "./navbar-item";
import { NextWorkoutButton } from "./next-workout-button";
import { useAppNavbar } from "./use-app-navbar";

export const AppNavbar = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { getNavbarItems, getRightNavbarItems, getCenterButtonConfig } = useAppNavbar();

  const handleConfirmLogout = () => {
    setIsLogoutDialogOpen(false);
    signOut();
    navigate({ to: "/", reloadDocument: true });
  };

  const navbarItems = getNavbarItems();
  const rightNavbarItems = getRightNavbarItems(() => setIsLogoutDialogOpen(true));
  const centerButtonConfig = getCenterButtonConfig();

  return (
    <nav className="bg-background border rounded-full mx-4 sm:max-w-md sm:mx-auto">
      <ul className="flex justify-between items-center p-2 relative">
        {navbarItems.map(item => (
          <NavbarItem key={item.path} {...item} />
        ))}

        <NextWorkoutButton
          onClick={centerButtonConfig.onClick}
          icon={centerButtonConfig.icon}
          disabled={centerButtonConfig.disabled}
          isLoading={centerButtonConfig.isLoading}
        />

        {rightNavbarItems.map((item, index) => (
          <NavbarItem key={item.path || `nav-item-${index}`} {...item} />
        ))}
      </ul>

      <LogoutDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
        onConfirmLogout={handleConfirmLogout}
      />
    </nav>
  );
};
