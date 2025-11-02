import { useNavigate } from "@tanstack/react-router";
import { BicepsFlexedIcon, LogOutIcon, MoonIcon, NotebookIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/web/lib/theme/use-theme";
import { useNextWorkoutQuery } from "@/web/modules/workouts/hooks/queries";

export const useAppNavbar = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { data: nextWorkout } = useNextWorkoutQuery();

  const handleNextWorkout = () => {
    if (nextWorkout) {
      navigate({
        to: "/workouts/$workoutId",
        params: { workoutId: String(nextWorkout.id) },
      });
    }
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

  return {
    handleNextWorkout,
    getNavbarItems,
    getRightNavbarItems,
  };
};
