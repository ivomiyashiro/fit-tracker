import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/web/components/ui";

import { CreateSetForm } from "./create-set-form.component";

export const CreateSetDrawer = ({
  isOpen,
  onClose,
  workoutId,
  workoutExerciseId,
}: {
  isOpen: boolean;
  onClose: () => void;
  workoutId: number;
  workoutExerciseId: number;
}) => {
  const handleSuccess = () => {
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="px-4 sm:px-0 sm:max-w-md sm:mx-auto">
          <DrawerTitle>Record Set</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 mt-4 sm:px-0 sm:max-w-md sm:mx-auto w-full mb-6">
          <CreateSetForm
            workoutId={workoutId}
            workoutExerciseId={workoutExerciseId}
            onSuccess={handleSuccess}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
