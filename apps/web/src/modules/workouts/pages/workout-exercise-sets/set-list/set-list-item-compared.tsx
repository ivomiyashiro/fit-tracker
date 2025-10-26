import type { WorkoutExerciseSet } from "../../../types";
import { ArrowDownIcon, ArrowUpIcon, GitCompareArrowsIcon, MinusIcon } from "lucide-react";

import { cn } from "@/web/lib/cn";

type Props = {
  set: WorkoutExerciseSet;
  previousSet: WorkoutExerciseSet;
};

type ComparisonMetric = {
  label: string;
  current: number;
  previous: number;
  unit?: string;
  showPercentage?: boolean;
};

const ComparisonItem = ({ label, current, previous, unit = "", showPercentage = true }: ComparisonMetric) => {
  const difference = current - previous;
  const percentageChange = previous !== 0 ? ((difference / previous) * 100) : 0;
  const isPositive = difference > 0;
  const isNeutral = difference === 0;

  const getIcon = () => {
    if (isNeutral)
return <MinusIcon className="w-3 h-3" />;
    return isPositive ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />;
  };

  const getColorClass = () => {
    if (isNeutral)
return "text-muted-foreground";
    return isPositive ? "text-green-500" : "text-red-500";
  };

  return (
    <div className="flex flex-col gap-1 p-3 bg-secondary/30 rounded-md">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-1.5 flex-col">
        <span className="text-lg font-semibold">
          {current}
          {unit}
        </span>
        <div className={cn("flex items-center gap-0.5 text-xs font-medium", getColorClass())}>
          {getIcon()}
          <span>
            {Math.abs(difference)}
            {unit}
          </span>
            {showPercentage && percentageChange !== 0 && (
                <span>
                    (
                    {isPositive ? "+" : ""}
                    {percentageChange.toFixed(0)}
                    %)
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

export const SetListItemCompared = ({ set, previousSet }: Props) => {
  const currentVolume = set.reps * set.weight;
  const previousVolume = previousSet.reps * previousSet.weight;

  const handleClick = (e: React.MouseEvent) => {
    // Prevent the click from bubbling up to parent elements
    e.stopPropagation();
  };

  return (
    <div
      className="flex flex-col gap-3"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <GitCompareArrowsIcon className="w-4 h-4 text-primary" />
        <p className="text-sm font-medium text-primary">Compared to previous workout</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {/* Row 1: Reps and Weight */}
        <ComparisonItem
          label="Reps"
          current={set.reps}
          previous={previousSet.reps}
        />
        <ComparisonItem
          label="Weight"
          current={set.weight}
          previous={previousSet.weight}
          unit="kg"
        />
        {/* Row 2: Volume and RIR */}
        <ComparisonItem
          label="Volume"
          current={currentVolume}
          previous={previousVolume}
          unit="kg"
        />
        {set.rir !== null && previousSet.rir !== null
? (
          <ComparisonItem
            label="RIR"
            current={set.rir}
            previous={previousSet.rir}
            showPercentage={false}
          />
        )
: (
          <div className="flex flex-col gap-1 p-3 bg-secondary/30 rounded-md">
            <span className="text-xs font-medium text-muted-foreground">RIR</span>
            <span className="text-lg font-semibold">
              {set.rir ?? "—"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
