import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/web/components/ui";

import { CreateSetDrawerForm } from "./create-set-drawer-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  workoutSessionId?: number;
  workoutExerciseId: number;
};

export const CreateSetDrawer = ({
  isOpen,
  onClose,
  workoutSessionId,
  workoutExerciseId,
}: Props) => {
  const handleSuccess = () => onClose();

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="px-4 sm:px-0 sm:max-w-md sm:mx-auto">
          <DrawerTitle>Record Set</DrawerTitle>
        </DrawerHeader>

        <div className="px-4 mt-4 sm:px-0 sm:max-w-md sm:mx-auto w-full mb-6">
          <CreateSetDrawerForm
            workoutSessionId={workoutSessionId}
            workoutExerciseId={workoutExerciseId}
            onSuccess={handleSuccess}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
