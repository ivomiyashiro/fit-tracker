import type { WorkoutExerciseSet } from "@/web/modules/workouts/types";

import { BicepsFlexedIcon, Repeat2Icon, WeightIcon } from "lucide-react";
import { memo } from "react";

import { Spinner } from "@/web/components/ui";

import { timeFormat } from "@/web/utils/date-format";
import { SetBadge } from "./set-badge";

type Props = {
  set: WorkoutExerciseSet;
  onClick?: () => void;
  disabled?: boolean;
};

export const SetListItem = memo(({ set, onClick, disabled }: Props) => {
  const isDisabled = disabled || set.isOptimistic;

  return (
    <div
      className={`flex flex-col gap-2 w-full ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={isDisabled ? undefined : onClick}
      aria-disabled={isDisabled}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 w-full">
          <span className="text-sm font-medium px-1 flex justify-between items-center gap-2">
            {timeFormat.format(new Date(set.createdAt))}
            {set.isOptimistic && (
              <span className="text-xs text-muted-foreground animate-pulse flex items-center gap-1">
                <Spinner className="size-3" />
                Saving...
              </span>
            )}
          </span>
          <div className={`flex gap-2 items-center mt-0.5 ${!set.notes ? "mb-1" : ""}`}>
            <SetBadge
              icon={<Repeat2Icon />}
              label="Reps"
              value={set.reps}
              className="text-green-500"
            />
            <SetBadge
              icon={<WeightIcon />}
              label="Weight"
              value={set.weight}
              unit="kg"
              className="text-orange-500"
            />
            {set.rir !== undefined && (
              <SetBadge
                icon={<BicepsFlexedIcon />}
                label="RIR"
                value={set.rir ?? 0}
                className="text-blue-500"
              />
            )}
          </div>
        </div>
      </div>
      {set.notes && <p className="text-sm text-muted-foreground mt-1 px-1">{set.notes}</p>}
    </div>
  );
});
