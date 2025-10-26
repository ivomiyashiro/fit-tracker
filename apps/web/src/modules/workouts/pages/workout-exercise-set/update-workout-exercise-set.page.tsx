import { PageLayout } from "@/web/components/layouts";
import { AppHeader, AppHeaderTitle } from "@/web/components/ui";
import { DeleteSetButton } from "@/web/modules/workouts/pages/workout-exercise-set/delete-set-button";
import { UpdateSetForm } from "@/web/modules/workouts/pages/workout-exercise-set/update-set-form";
import { UpdateSetFormSkeleton } from "@/web/modules/workouts/pages/workout-exercise-set/update-set-form-skeleton";
import { useUpdateWorkoutExerciseSet } from "./update-workout-exercise-set.page.hook";

const UpdateWorkoutExerciseSetPage = () => {
  const {
    // Data
    setToUpdate,

    setId,

    // UI state
    isLoading,

    // Actions
    handleBackClick,
  } = useUpdateWorkoutExerciseSet();

  if (!setToUpdate && !isLoading) {
    return (
      <>
        <AppHeader title="Set Not Found" showBackButton onBackButtonClick={handleBackClick} />
        <PageLayout
          meta={{ title: "Update Set", description: "Update workout exercise set" }}
          className="flex flex-col gap-4"
        >
          <div className="text-center py-8">
            <p className="text-muted-foreground">The set you're trying to update was not found.</p>
          </div>
        </PageLayout>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title={<AppHeaderTitle title="Edit Set" />}
        showBackButton
        onBackButtonClick={handleBackClick}
      />
      <PageLayout
        meta={{ title: "Update Set", description: "Update workout exercise set" }}
        className="flex flex-col gap-4"
      >
        {isLoading
? (
          <UpdateSetFormSkeleton />
        )
: (
          setToUpdate && (
            <>
              <UpdateSetForm
                setId={Number(setId)}
                initialData={setToUpdate}
              />
              <DeleteSetButton setId={Number(setId)} />
            </>
          )
        )}
      </PageLayout>
    </>
  );
};

export default UpdateWorkoutExerciseSetPage;
