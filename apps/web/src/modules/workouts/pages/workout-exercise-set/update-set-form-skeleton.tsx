import { Skeleton } from "@/web/components/ui";

export const UpdateSetFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4">
      {/* Reps field */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Weight field */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* RIR field */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Notes field */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-20 w-full" />
      </div>

      {/* Submit button */}
      <div className="mt-4">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Delete button skeleton */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
