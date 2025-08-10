import { useNavigate, useParams } from "@tanstack/react-router";
import { useMemo } from "react";

import { useCachedOrWorkoutExerciseSetsSuspenseQuery } from "@/web/modules/workouts/hooks/queries";
import { AppHeader } from "@/web/components/ui";
import { PageLayout } from "@/web/components/layouts";
import { UpdateSetForm, DeleteSetButton } from "@/web/modules/workouts/components/forms";

const UpdateWorkoutExerciseSetPage = () => {
  const { workoutId, workoutExerciseId, setId } = useParams({ from: "/workouts/$workoutId/$workoutExerciseId/$setId" });
  const navigate = useNavigate();

  const { data } = useCachedOrWorkoutExerciseSetsSuspenseQuery({
    workoutId: Number(workoutId),
    workoutExerciseId: Number(workoutExerciseId),
    pagination: {
      cursor: 0,
      limit: 100, // Get all sets to find the one we're updating
    },
  });

  const setToUpdate = useMemo(() => {
    return data.data.find(set => set.id === Number(setId));
  }, [data.data, setId]);

  const handleSuccess = () => {
    navigate({
      to: "/workouts/$workoutId/workout-exercises/$workoutExerciseId/sets",
      params: { workoutId: String(workoutId), workoutExerciseId: String(workoutExerciseId) },
    });
  };

  const handleBackClick = () => {
    navigate({
      to: "/workouts/$workoutId/workout-exercises/$workoutExerciseId/sets",
      params: { workoutId: String(workoutId), workoutExerciseId: String(workoutExerciseId) },
    });
  };

  const handleDeleteSuccess = () => {
    navigate({
      to: "/workouts/$workoutId/workout-exercises/$workoutExerciseId/sets",
      params: { workoutId: String(workoutId), workoutExerciseId: String(workoutExerciseId) },
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
          workoutId={Number(workoutId)}
          workoutExerciseId={Number(workoutExerciseId)}
          initialData={setToUpdate}
          onSuccess={handleSuccess}
        />
        <DeleteSetButton
          workoutId={Number(workoutId)}
          workoutExerciseId={Number(workoutExerciseId)}
          setId={Number(setId)}
          onSuccess={handleDeleteSuccess}
        />
      </PageLayout>
    </>
  );
};

export default UpdateWorkoutExerciseSetPage;
