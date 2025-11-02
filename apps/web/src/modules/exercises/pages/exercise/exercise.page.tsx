import { useParams } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader, DeleteConfirmationButton } from "@/web/components/ui";
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
              <DeleteConfirmationButton
                title="Delete Exercise"
                description="Are you sure you want to delete this exercise? This action cannot be undone and will also remove this exercise from all workouts."
                buttonText="Delete Exercise"
                deletingText="Deleting..."
                confirmText="Delete"
                isDeleting={isDeleting}
                onConfirm={handleDelete}
                disabled={isEditing}
                variant="destructive"
                className="w-full"
              />
            </>
            )}
      </PageLayout>
    </>
  );
};

export default ExercisePage;
