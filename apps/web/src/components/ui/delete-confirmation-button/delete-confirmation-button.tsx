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

type DeleteConfirmationButtonProps = {
  buttonText?: string;
  className?: string;
  confirmText?: string;
  deletingText?: string;
  description?: string;
  disabled?: boolean;
  isDeleting: boolean;
  onConfirm: () => void;
  title?: string;
  variant?: "outline" | "destructive" | "default";
};

export const DeleteConfirmationButton = ({
  buttonText = "Delete",
  className,
  confirmText = "Delete",
  deletingText = "Deleting...",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  disabled = false,
  isDeleting,
  onConfirm,
  title = "Confirm Deletion",
  variant = "destructive",
}: DeleteConfirmationButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          className={cn(variant === "outline" && "text-destructive", className)}
          disabled={disabled || isDeleting}
        >
          <span>{isDeleting ? deletingText : buttonText}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleDelete}
            className="bg-destructive text-white hover:bg-destructive/90"
            disabled={isDeleting}
          >
            {isDeleting && <Spinner />}
            {isDeleting ? deletingText : confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
