import { PageLayout } from "@/web/components/layouts";
import { AppHeader } from "@/web/components/ui";
import { ExerciseForm } from "@/web/modules/exercises/components";

import { useExerciseCreate } from "./exercise-create.page.hook";

const ExerciseCreatePage = () => {
  const {
    name,
    selectedMuscleGroups,
    isCreating,
    canSave,
    handleNameChange,
    handleMuscleGroupsChange,
    handleCreate,
  } = useExerciseCreate();

  return (
    <>
      <AppHeader
        showBackButton={true}
        title="New Exercise"
      />
      <PageLayout
        meta={{ title: "Create Exercise", description: "Create a new exercise" }}
        className="flex flex-col gap-4"
      >
        <ExerciseForm
          name={name}
          selectedMuscleGroups={selectedMuscleGroups}
          isSubmitting={isCreating}
          canSave={canSave}
          submitButtonText="Add New Exercise"
          submittingButtonText="Creating..."
          onNameChange={handleNameChange}
          onMuscleGroupsChange={handleMuscleGroupsChange}
          onSubmit={handleCreate}
        />
      </PageLayout>
    </>
  );
};

export default ExerciseCreatePage;
