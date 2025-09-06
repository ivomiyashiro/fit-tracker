import { useNavigate, useParams } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader } from "@/web/components/ui";
import { useWorkoutExerciseSetByIdQuery } from "@/web/modules/workouts/hooks/queries/use-workout-exercise-set-by-id.query";
import { DeleteSetButton } from "@/web/modules/workouts/pages/workout-exercise-set/delete-set-button";
import { UpdateSetForm } from "@/web/modules/workouts/pages/workout-exercise-set/update-set-form";

const UpdateWorkoutExerciseSetPage = () => {
  const navigate = useNavigate();
  const { workoutId, workoutExerciseId, setId } = useParams({
    from: "/_authenticated/workouts/$workoutId/we/$workoutExerciseId/sets/$setId/",
  });

  const { data: setToUpdate } = useWorkoutExerciseSetByIdQuery(Number(setId));

  const handleBackClick = () => {
    navigate({
      to: "/workouts/$workoutId/we/$workoutExerciseId/sets",
      params: {
        workoutId,
        workoutExerciseId,
      },
    });
  };

  if (!setToUpdate) {
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
      <AppHeader title="Edit Set" showBackButton onBackButtonClick={handleBackClick} />
      <PageLayout
        meta={{ title: "Update Set", description: "Update workout exercise set" }}
        className="flex flex-col gap-4"
      >
        <UpdateSetForm
          setId={Number(setId)}
          initialData={setToUpdate}
        />
        <DeleteSetButton setId={Number(setId)} />
      </PageLayout>
    </>
  );
};

export default UpdateWorkoutExerciseSetPage;
