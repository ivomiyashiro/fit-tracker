import { LogOutIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/web/components/ui";

type LogoutDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmLogout: () => void;
};

export const LogoutDialog = ({ open, onOpenChange, onConfirmLogout }: LogoutDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you sure you want to logout?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-between">
          <AlertDialogCancel onClick={onConfirmLogout}>
            <LogOutIcon />
            Logout
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onOpenChange(false)}>Cancel</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
