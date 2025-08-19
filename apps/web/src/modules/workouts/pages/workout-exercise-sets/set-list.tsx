import { useNavigate } from "@tanstack/react-router";
import { BicepsFlexedIcon, Repeat2Icon, WeightIcon } from "lucide-react";

import type { ItemClickEvent } from "@/web/components/ui/list/list.types";
import type { WorkoutExerciseSet } from "@/web/modules/workouts/types";

import { Badge, List } from "@/web/components/ui";
import { cn } from "@/web/lib/cn";

const SetBadge = ({
  className,
  icon,
  label,
  value,
  unit,
}: {
  className?: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
}) => {
  return (
    <div className="flex gap-2 items-center mt-0.5">
      <Badge variant="outline" className={cn("text-xs px-2.5 py-1.5", className)}>
        {icon}
        <span className="text-xs mt-0.5">
          {label}
          :
          {value}
          {" "}
          {unit && `${unit}`}
        </span>
      </Badge>
    </div>
  );
};

export const SetList = ({
  sets,
  workoutId,
  workoutExerciseId,
}: {
  sets: WorkoutExerciseSet[];
  workoutId?: number;
  workoutExerciseId?: number;
}) => {
  const navigate = useNavigate();

  const handleSetClick = (e: ItemClickEvent<WorkoutExerciseSet>) => {
    const set = e.item;
    if (workoutId && workoutExerciseId) {
      navigate({
        to: "/workouts/$workoutId/we/$workoutExerciseId/sets/$setId",
        params: {
          workoutId: String(workoutId),
          workoutExerciseId: String(workoutExerciseId),
          setId: String(set.id),
        },
      });
    }
  };

  if (sets.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">No sets recorded yet</h3>
        <p className="text-muted-foreground">Add your first set to get started!</p>
      </div>
    );
  }

  return (
    <List
      dataSource={sets}
      keyExpr="id"
      noDataText="No sets found"
      onItemClick={handleSetClick}
      title="Workout sets"
      itemTemplate={({ itemData: set }) => (
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium px-1">
                {new Date(set.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
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
      )}
    />
  );
};
