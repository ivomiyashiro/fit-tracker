import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type NavbarContextType = {
  startWorkoutHandlerRef: React.MutableRefObject<(() => void) | null>;
  isStartingWorkout: boolean;
  isLoadingWorkout: boolean;
  setIsStartingWorkout: (isStarting: boolean) => void;
  setIsLoadingWorkout: (isLoading: boolean) => void;
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const startWorkoutHandlerRef = useRef<(() => void) | null>(null);
  const [isStartingWorkout, setIsStartingWorkout] = useState(false);
  const [isLoadingWorkout, setIsLoadingWorkout] = useState(false);

  // Memoize setter functions to prevent recreating them on every render
  const memoizedSetIsStartingWorkout = useCallback((isStarting: boolean) => {
    setIsStartingWorkout(isStarting);
  }, []);

  const memoizedSetIsLoadingWorkout = useCallback((isLoading: boolean) => {
    setIsLoadingWorkout(isLoading);
  }, []);

  const value = useMemo(
    () => ({
      startWorkoutHandlerRef,
      isStartingWorkout,
      isLoadingWorkout,
      setIsStartingWorkout: memoizedSetIsStartingWorkout,
      setIsLoadingWorkout: memoizedSetIsLoadingWorkout,
    }),
    [
      isStartingWorkout,
      isLoadingWorkout,
      memoizedSetIsStartingWorkout,
      memoizedSetIsLoadingWorkout,
    ],
  );

  return (
    <NavbarContext value={value}>
      {children}
    </NavbarContext>
  );
};

export const useNavbarContext = () => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error("useNavbarContext must be used within a NavbarProvider");
  }
  return context;
};
