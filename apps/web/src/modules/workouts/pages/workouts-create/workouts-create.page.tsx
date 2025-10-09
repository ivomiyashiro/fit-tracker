import { Label } from "@radix-ui/react-label";
import { useNavigate } from "@tanstack/react-router";
import { useId } from "react";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button, FormField, Spinner } from "@/web/components/ui";
import { ExerciseSelectionList } from "@/web/modules/workouts/components/exercise-list/exercise-list.index";

import { useCreateWorkout } from "./workouts-create.page.hook";

const CreateWorkoutPage = () => {
  const formId = useId();
  const navigate = useNavigate();

  const {
    errors,
    handleSelectionChanged,
    hasSelection,
    register,

    // Actions
    handleCreateWorkout,
    isPending,
  } = useCreateWorkout();

  return (
    <>
      <AppHeader
        title="Create Workout"
        showBackButton
        onBackButtonClick={() => navigate({ to: "/workouts" })}
      />
      <PageLayout
        meta={{ title: "Create Workout", description: "Create a new workout" }}
        className="flex flex-col gap-8"
      >
        <div className="flex flex-col gap-4">
        <form id={formId} onSubmit={handleCreateWorkout}>
          <FormField
            label="Workout Name"
            error={errors.name}
            register={register("name")}
            placeholder="Enter workout name"
          />
        </form>
        <Label className="text-sm ml-3 -mb-2">Select your exercises</Label>
        <ExerciseSelectionList
          searchPlaceholder="Search exercises exercises..."
          onSelectionChanged={handleSelectionChanged}
        />
        <div className="mt-4">
          <Button
            form={formId}
            type="submit"
            className="w-full"
            disabled={isPending || !hasSelection}
          >
            { isPending && <Spinner />}
            Create Workout
          </Button>
        </div>
        </div>
      </PageLayout>
    </>
  );
};

export default CreateWorkoutPage;
