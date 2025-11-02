import { PageLayout } from "@/web/components/layouts";
import { AppHeader } from "@/web/components/ui";
import { ExerciseForm } from "@/web/modules/exercises/components";

import { useExerciseEdit } from "./exercise.page.hook";

const ExercisePage = () => {
  const {
    name,
    selectedMuscleGroups,
    isEditing,
    canSave,
    handleNameChange,
    handleMuscleGroupsChange,
    handleSave,
  } = useExerciseEdit();

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
      </PageLayout>
    </>
  );
};

export default ExercisePage;
