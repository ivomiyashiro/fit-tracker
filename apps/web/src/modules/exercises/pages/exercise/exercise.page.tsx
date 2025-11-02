import { useParams } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, Button } from "@/web/components/ui";
import { ExerciseForm, ExerciseFormSkeleton } from "@/web/modules/exercises/components";

import { useExerciseEdit } from "./exercise.page.hook";

const ExercisePage = () => {
  const { exerciseId } = useParams({ from: "/_authenticated/exercises/$exerciseId/" });
  const {
    name,
    selectedMuscleGroups,
    isLoading,
    isEditing,
    isDeleting,
    canSave,
    handleNameChange,
    handleMuscleGroupsChange,
    handleSave,
    handleDelete,
  } = useExerciseEdit({ exerciseId: Number(exerciseId) });

  return (
    <>
      <AppHeader
        showBackButton={true}
        title="Edit Exercise"
      />
      <PageLayout
        meta={{ title: "Edit Exercise", description: "Edit exercise details" }}
        className="flex flex-col gap-4"
      >
        {isLoading
          ? (
            <ExerciseFormSkeleton />
            )
          : (
            <>
              <ExerciseForm
                name={name}
                selectedMuscleGroups={selectedMuscleGroups}
                isSubmitting={isEditing}
                canSave={canSave}
                submitButtonText="Save Changes"
                submittingButtonText="Saving..."
                onNameChange={handleNameChange}
                onMuscleGroupsChange={handleMuscleGroupsChange}
                onSubmit={handleSave}
              />
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
                disabled={isDeleting || isEditing}
              >
                {isDeleting ? "Deleting..." : "Delete Exercise"}
              </Button>
            </>
            )}
      </PageLayout>
    </>
  );
};

export default ExercisePage;
