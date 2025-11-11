import { useLocation, useNavigate } from "@tanstack/react-router";
import { BicepsFlexedIcon, CalendarIcon, LogOutIcon, NotebookIcon, PlayCircle, Plus } from "lucide-react";

import { useNavbarContext } from "./navbar-context";

export const useAppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    startWorkoutHandlerRef,
    isStartingWorkout,
    isLoadingWorkout,
    addSetHandlerRef,
    isAddingSet,
  } = useNavbarContext();

  const isOnTodaysWorkoutPage = location.pathname === "/todays-workout";
  const isOnActiveSessionPage = location.pathname.includes("/todays-workout/session/");

  const handleNextWorkout = () => {
    navigate({ to: "/workout-sessions/todays-workout" });
  };

  const getNavbarItems = () => [
    {
      icon: <CalendarIcon className="w-5 h-5" />,
      path: "/workout-sessions" as const,
      onClick: () => navigate({ to: "/workout-sessions" }),
    },
    {
      icon: <NotebookIcon className="w-5 h-5" />,
      path: "/workouts" as const,
      onClick: () => navigate({ to: "/workouts" }),
    },
  ];

  const getRightNavbarItems = (onLogoutClick: () => void) => [
    {
      icon: <BicepsFlexedIcon className="w-5 h-5" />,
      path: "/exercises" as const,
      onClick: () => navigate({ to: "/exercises" }),
    },
    {
      icon: <LogOutIcon className="w-5 h-5" />,
      path: "/logout" as const,
      onClick: onLogoutClick,
    },
  ];

  const getCenterButtonConfig = () => {
    // Active session page - show "+" button to add set
    if (isOnActiveSessionPage) {
      return {
        icon: <Plus className="w-7 h-7 text-primary-foreground" />,
        onClick: () => addSetHandlerRef.current?.(),
        disabled: isAddingSet,
        isLoading: isAddingSet,
      };
    }

    // Today's workout page - show play button to start workout
    if (isOnTodaysWorkoutPage) {
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
    isOnActiveSessionPage,
  };
};
