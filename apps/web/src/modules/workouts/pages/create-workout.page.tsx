import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { PageLayout } from "@/web/components/layouts";
import { AppHeader } from "@/web/components/ui";
import { CreateWorkoutForm } from "@/web/modules/workouts/components/forms/create-workout-form";
import { useCreateWorkoutMutation } from "@/web/modules/workouts/hooks/mutations";


const CreateWorkoutPage = () => {
  const navigate = useNavigate();

  const { mutate: createWorkout, isPending } = useCreateWorkoutMutation({
    onSettled: () => {
      navigate({ to: "/workouts" });
    },
    onError: error => {
      toast.error(error.message || "Failed to create workout");
    },
  });

  const handleSubmit = (data: CreateWorkoutRequest) => {
    createWorkout(data);
  };

  return (
    <>
      <AppHeader
        title="Create Workout"
        showBackButton
        onBackButtonClick={() => navigate({ to: "/workouts" })}
      />
      <PageLayout
        meta={{ title: "Create Workout", description: "Create a new workout" }}
        className="flex flex-col gap-8"
      >
        <CreateWorkoutForm
          onSubmit={handleSubmit}
          isPending={isPending}
          submitButtonText="Create Workout"
        />
      </PageLayout>
    </>
  );
};

export default CreateWorkoutPage;
