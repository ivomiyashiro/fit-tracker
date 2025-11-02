import { DumbbellIcon } from "lucide-react";

type NextWorkoutButtonProps = {
  onClick: () => void;
};

export const NextWorkoutButton = ({ onClick }: NextWorkoutButtonProps) => {
  return (
    <>
      <li className="px-6"></li>
      <li className="absolute left-1/2 -translate-x-1/2 bottom-5">
        <div className="relative inline-block">
          <span className="absolute inset-0 rounded-full pointer-events-none scale-110 bg-primary/60 animate-pulse" />
          <button
            type="button"
            onClick={onClick}
            className="relative p-3 transition-colors rounded-full bg-primary z-10"
          >
            <DumbbellIcon className="w-7 h-7 text-primary-foreground" />
          </button>
        </div>
      </li>
    </>
  );
};
