import { useNavigate, useParams } from "@tanstack/react-router";

import { DeleteConfirmationButton } from "@/web/components/ui";
import { useDeleteWorkoutExerciseSetMutation } from "@/web/modules/workouts/hooks/mutations";

export const DeleteSetButton = ({
  setId,
  className,
}: {
  setId: number;
  className?: string;
}) => {
  const navigate = useNavigate();
  const { workoutId, workoutExerciseId } = useParams({
    from: "/_authenticated/workouts/$workoutId/we/$workoutExerciseId/sets/$setId/",
  });

  const { mutate: deleteSetMutation, isPending } = useDeleteWorkoutExerciseSetMutation();

  const handleDelete = () => {
    deleteSetMutation(
      { setId },
      {
        onSuccess: () => {
          navigate({
            to: "/workouts/$workoutId/we/$workoutExerciseId/sets",
            params: { workoutId, workoutExerciseId },
          });
        },
      },
    );
  };

  return (
    <DeleteConfirmationButton
      title="Delete Set"
      description="Are you sure you want to delete this set? This action cannot be undone."
      buttonText="Delete Set"
      deletingText="Deleting..."
      confirmText="Delete"
      isDeleting={isPending}
      onConfirm={handleDelete}
      variant="outline"
      className={className}
    />
  );
};
