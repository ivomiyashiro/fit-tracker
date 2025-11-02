import type { ReactNode } from "react";
import { DumbbellIcon, Loader2 } from "lucide-react";

type NextWorkoutButtonProps = {
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
};

export const NextWorkoutButton = ({ onClick, icon, disabled, isLoading }: NextWorkoutButtonProps) => {
  return (
    <>
      <li className="px-6"></li>
      <li className="absolute left-1/2 -translate-x-1/2 bottom-5">
        <div className="relative inline-block">
          <span className="absolute inset-0 rounded-full pointer-events-none scale-110 bg-primary/60 animate-pulse" />
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="relative p-3 transition-colors rounded-full bg-primary z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
? (
              <Loader2 className="w-7 h-7 text-primary-foreground animate-spin" />
            )
: (
              icon || <DumbbellIcon className="w-7 h-7 text-primary-foreground" />
            )}
          </button>
        </div>
      </li>
    </>
  );
};
