import type { WorkoutExerciseSet } from "../../../types";
import { GitCompareArrowsIcon } from "lucide-react";
import { memo, useMemo } from "react";
import { ComparisonItem } from "./set-list-item-compared-item";

type Props = {
  currentDaySets: WorkoutExerciseSet[];
  previousDaySets: WorkoutExerciseSet[];
};

export const SetListItemCompared = memo(({ currentDaySets, previousDaySets }: Props) => {
  // Calculate totals and maximums for current day
  const currentTotalReps = useMemo(() => currentDaySets.reduce((sum, s) => sum + s.reps, 0), [currentDaySets]);
  const currentMaxWeight = useMemo(() => Math.max(...currentDaySets.map(s => s.weight)), [currentDaySets]);
  const currentTotalVolume = useMemo(() => currentDaySets.reduce((sum, s) => sum + (s.reps * s.weight), 0), [currentDaySets]);
  const currentAvgRir = useMemo(() => {
    const rirValues = currentDaySets.filter(s => s.rir !== null).map(s => s.rir!);
    return rirValues.length > 0 ? rirValues.reduce((sum, rir) => sum + rir, 0) / rirValues.length : null;
  }, [currentDaySets]);

  // Calculate totals and maximums for previous day
  const previousTotalReps = useMemo(() => previousDaySets.reduce((sum, s) => sum + s.reps, 0), [previousDaySets]);
  const previousMaxWeight = useMemo(() => Math.max(...previousDaySets.map(s => s.weight)), [previousDaySets]);
  const previousTotalVolume = useMemo(() => previousDaySets.reduce((sum, s) => sum + (s.reps * s.weight), 0), [previousDaySets]);
  const previousAvgRir = useMemo(() => {
    const rirValues = previousDaySets.filter(s => s.rir !== null).map(s => s.rir!);
    return rirValues.length > 0 ? rirValues.reduce((sum, rir) => sum + rir, 0) / rirValues.length : null;
  }, [previousDaySets]);

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
          label="Max Weight"
          current={currentMaxWeight}
          previous={previousMaxWeight}
          unit="kg"
        />
        <ComparisonItem
          label="Toal Reps"
          current={currentTotalReps}
          previous={previousTotalReps}
        />
        {/* Row 2: Volume and RIR */}
        <ComparisonItem
          label="Volume"
          current={currentTotalVolume}
          previous={previousTotalVolume}
          unit="kg"
        />
        {currentAvgRir !== null && previousAvgRir !== null
? (
          <ComparisonItem
            label="Avg RIR"
            current={currentAvgRir}
            previous={previousAvgRir}
            showPercentage={false}
            lowerIsBetter={true}
            decimalPlaces={1}
          />
        )
: (
          <div className="flex flex-col gap-1 p-3 bg-secondary/30 rounded-md">
            <span className="text-xs font-medium text-muted-foreground">Avg RIR</span>
            <span className="text-lg font-semibold">
              {currentAvgRir !== null ? currentAvgRir.toFixed(1) : "—"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});
