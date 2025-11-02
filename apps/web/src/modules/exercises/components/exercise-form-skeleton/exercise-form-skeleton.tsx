import { Skeleton } from "@/web/components/ui";

export const ExerciseFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Name input skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Muscle groups section skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
};
