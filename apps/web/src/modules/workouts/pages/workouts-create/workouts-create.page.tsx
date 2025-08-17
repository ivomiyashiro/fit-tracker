import { useNavigate } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button, FormField } from "@/web/components/ui";
import { ExerciseSelectionList } from "@/web/modules/workouts/components/lists/exercise-list/exercise-list.index";
import { useWorkoutForm, useCreateWorkout } from "./workouts-create.page.hook";

const CreateWorkoutPage = () => {
  const navigate = useNavigate();
  const { createWorkout, isPending } = useCreateWorkout();

  const {
    register,
    handleSubmit,
    errors,
    selectedExerciseIds,
    toggleSelection,
    hasSelection
  } = useWorkoutForm({
    initialData: {
      name: "",
      exerciseIds: [],
    },
  });

  const onSubmit = handleSubmit(data => {
    createWorkout({
      name: data.name,
      exerciseIds: selectedExerciseIds,
    });
  });

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
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-2">
            <FormField
              label="Workout Name"
              error={errors.name}
              register={register("name")}
              placeholder="Enter workout name"
            />
          </div>
          <ExerciseSelectionList
            selectedExerciseIds={selectedExerciseIds}
            toggleSelection={toggleSelection}
            title="Select exercises for workout"
            searchPlaceholder="Search exercises to include in workout..."
          />
          <div className="mt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !hasSelection}
            >
              Create Workout
            </Button>
          </div>
        </form>
      </PageLayout>
    </>
  );
};

export default CreateWorkoutPage;