import { useNavigate, useParams } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Spinner,
} from "@/web/components/ui";
import { cn } from "@/web/lib/cn";
import { useDeleteWorkoutExerciseSetMutation } from "@/web/modules/workouts/hooks/mutations";

export const DeleteSetButton = ({
  setId,
  className,
}: {
  setId: number;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { workoutId, workoutExerciseId } = useParams({
    from: "/_authenticated/workouts/$workoutId/we/$workoutExerciseId/sets/$setId/",
  });

  const { mutate: deleteSetMutation, isPending } = useDeleteWorkoutExerciseSetMutation();

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    deleteSetMutation(
      { setId },
      {
        onSuccess: () => {
          setIsOpen(false);
          navigate({
            to: "/workouts/$workoutId/we/$workoutExerciseId/sets",
            params: { workoutId, workoutExerciseId },
          });
        },
      },
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("text-destructive", className)}
          disabled={isPending}
        >
          <Trash2 />
          <span>Delete Set</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Set</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this set? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
