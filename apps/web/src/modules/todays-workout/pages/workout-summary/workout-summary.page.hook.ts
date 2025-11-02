import { useNavigate, useParams } from "@tanstack/react-router";

import { useWorkoutSessionSummaryQuery } from "@/web/modules/todays-workout/hooks";

export const useWorkoutSummary = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams({ strict: false });

  const { data: summary, isLoading } = useWorkoutSessionSummaryQuery(Number(sessionId));

  const handleFinish = () => {
    navigate({ to: "/workouts" });
  };

  const formatDuration = (seconds: number | null | undefined) => {
    if (!seconds)
return "0m";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatWeight = (weight: number) => {
    return `${weight} kg`;
  };

  return {
    summary,
    isLoading,
    handleFinish,
    formatDuration,
    formatWeight,
  };
};
