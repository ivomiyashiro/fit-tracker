import { useLocation, useNavigate } from "@tanstack/react-router";
import { BicepsFlexedIcon, LogOutIcon, MoonIcon, NotebookIcon, PlayCircle, SunIcon } from "lucide-react";

import { useTheme } from "@/web/lib/theme/use-theme";

import { useNavbarContext } from "./navbar-context";

export const useAppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { startWorkoutHandlerRef, isStartingWorkout, isLoadingWorkout } = useNavbarContext();

  const isOnTodaysWorkoutPage = location.pathname === "/todays-workout";

  const handleNextWorkout = () => {
    navigate({ to: "/todays-workout" });
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const getNavbarItems = () => [
    {
      icon: <NotebookIcon className="w-5 h-5" />,
      path: "/workouts" as const,
      onClick: () => navigate({ to: "/workouts" }),
    },
    {
      icon: <BicepsFlexedIcon className="w-5 h-5" />,
      path: "/exercises" as const,
      onClick: () => navigate({ to: "/exercises" }),
    },
  ];

  const getRightNavbarItems = (onLogoutClick: () => void) => [
    {
      icon: theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />,
      onClick: toggleTheme,
    },
    {
      icon: <LogOutIcon className="w-5 h-5" />,
      path: "/logout" as const,
      onClick: onLogoutClick,
    },
  ];

  const getCenterButtonConfig = () => {
    if (isOnTodaysWorkoutPage && startWorkoutHandlerRef.current) {
      return {
        icon: <PlayCircle className="w-7 h-7 text-primary-foreground" />,
        onClick: () => startWorkoutHandlerRef.current?.(),
        disabled: isStartingWorkout || isLoadingWorkout,
        isLoading: isStartingWorkout,
      };
    }

    return {
      icon: null,
      onClick: handleNextWorkout,
      disabled: false,
      isLoading: false,
    };
  };

  return {
    handleNextWorkout,
    getNavbarItems,
    getRightNavbarItems,
    getCenterButtonConfig,
    isOnTodaysWorkoutPage,
  };
};
