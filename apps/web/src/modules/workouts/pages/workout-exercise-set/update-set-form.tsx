import { Controller } from "react-hook-form";

import type { WorkoutExerciseSet } from "@/web/modules/workouts/types";

import { Button, FormField, IncrementInput, Textarea } from "@/web/components/ui";
import { useUpdateWorkoutExerciseSetForm } from "@/web/modules/workouts/pages/workout-exercise-set/update-set-form.hook";

export const UpdateSetForm = ({
  setId,
  initialData,
}: {
  setId: number;
  initialData: WorkoutExerciseSet;
}) => {
  const { form, handleSubmit, isPending, isValid } = useUpdateWorkoutExerciseSetForm({
    setId,
    initialData,
  });

  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField
        label="Repetitions"
        id="reps"
        error={errors.reps}
        register={register("reps", { valueAsNumber: true })}
      >
        <Controller
          name="reps"
          control={control}
          render={({ field }) => (
            <IncrementInput
              value={field.value?.toString() || ""}
              onChange={value => field.onChange(value ? Number.parseInt(value) : undefined)}
              step={1}
              min={1}
              placeholder="8"
            />
          )}
        />
      </FormField>

      <FormField
        label="Weight (kg)"
        id="weight"
        error={errors.weight}
        register={register("weight", { valueAsNumber: true })}
      >
        <Controller
          name="weight"
          control={control}
          render={({ field }) => (
            <IncrementInput
              value={field.value?.toString() || ""}
              onChange={value => field.onChange(value ? Number.parseFloat(value) : undefined)}
              step={2.5}
              min={0}
              placeholder="0"
            />
          )}
        />
      </FormField>

      <FormField
        label="RIR (Reps in Reserve)"
        id="rir"
        error={errors.rir}
        register={register("rir", {
          setValueAs: value => (value === "" || value === null ? undefined : Number(value)),
        })}
      >
        <Controller
          name="rir"
          control={control}
          render={({ field }) => (
            <IncrementInput
              value={field.value?.toString() || ""}
              onChange={value => field.onChange(value ? Number.parseInt(value) : undefined)}
              step={1}
              min={0}
              max={10}
              placeholder="2"
            />
          )}
        />
      </FormField>

      <FormField label="Notes" id="notes" error={errors.notes} register={register("notes")}>
        <Textarea placeholder="Add any notes about this set..." className="resize-none" rows={3} />
      </FormField>

      <div className="mt-4">
        <Button type="submit" className="w-full" disabled={isPending || !isValid}>
          {isPending ? "Updating..." : "Update Set"}
        </Button>
      </div>
    </form>
  );
};
