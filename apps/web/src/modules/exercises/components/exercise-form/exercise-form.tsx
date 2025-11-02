import type { MuscleGroup } from "@/web/modules/exercises/types";

import { Button, Input, Label, Spinner } from "@/web/components/ui";
import { MuscleGroupSelectionList } from "@/web/modules/exercises/components";

type ExerciseFormProps = {
  name: string;
  selectedMuscleGroups: MuscleGroup[];
  isSubmitting: boolean;
  canSave: boolean;
  submitButtonText?: string;
  submittingButtonText?: string;
  onNameChange: (value: string) => void;
  onMuscleGroupsChange: (muscleGroups: MuscleGroup[]) => void;
  onSubmit: () => void;
};

export const ExerciseForm = ({
  name,
  selectedMuscleGroups,
  isSubmitting,
  canSave,
  submitButtonText = "Save Changes",
  submittingButtonText = "Saving...",
  onNameChange,
  onMuscleGroupsChange,
  onSubmit,
}: ExerciseFormProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="exercise-name" className="ml-2">
          Exercise Name
        </Label>
        <Input
          id="exercise-name"
          type="text"
          value={name}
          onChange={e => onNameChange(e.target.value)}
          placeholder="Enter exercise name..."
          className="w-full"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="ml-2">
          Muscle Groups
        </Label>
        <MuscleGroupSelectionList
          selectedMuscleGroups={selectedMuscleGroups}
          onSelectionChanged={onMuscleGroupsChange}
          selectionEnabled={true}
        />
      </div>

      <div className="flex flex-col justify-end gap-2">
        <Button
          onClick={onSubmit}
          disabled={!canSave || isSubmitting}
        >
          {isSubmitting ? <Spinner /> : null}
          {isSubmitting ? submittingButtonText : submitButtonText}
        </Button>
      </div>
    </div>
  );
};
