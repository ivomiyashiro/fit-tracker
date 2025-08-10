import { Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/web/components/ui";
import { cn } from "@/web/lib/cn";
import { useDeleteWorkoutExerciseSetMutation } from "@/web/modules/workouts/hooks/mutations";

export const DeleteSetButton = ({
  workoutId,
  workoutExerciseId,
  setId,
  onSuccess,
  className,
}: {
  workoutId: number;
  workoutExerciseId: number;
  setId: number;
  onSuccess?: () => void;
  className?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const deleteSetMutation = useDeleteWorkoutExerciseSetMutation({
    workoutId,
    workoutExerciseId,
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
  });

  const handleDelete = () => {
    deleteSetMutation.mutate({ setId });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className={cn("text-destructive", className)}
          disabled={deleteSetMutation.isPending}
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
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={deleteSetMutation.isPending}
          >
            {deleteSetMutation.isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
