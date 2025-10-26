import { Skeleton } from "@/web/components/ui";

const SetListItemSkeleton = () => {
  return (
    <div className="flex flex-col gap-2 w-full p-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          {/* Time skeleton */}
          <Skeleton className="h-4 w-16" />
          {/* Badges skeleton */}
          <div className="flex gap-2 items-center mt-0.5 mb-1">
            <Skeleton className="h-6 w-12" />
            <Skeleton className="h-6 w-14" />
            <Skeleton className="h-6 w-10" />
          </div>
        </div>
      </div>
      {/* Notes skeleton (sometimes visible) */}
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
};

const SetListGroupSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {/* Date header skeleton */}
      <Skeleton className="h-4 w-20 ml-3" />
      {/* List items skeleton */}
      <div className="border rounded-lg divide-y">
        <SetListItemSkeleton />
        <SetListItemSkeleton />
        <SetListItemSkeleton />
      </div>
    </div>
  );
};

export const SetListSkeleton = () => {
  return (
    <div className="flex flex-col gap-8">
      <SetListGroupSkeleton />
      <SetListGroupSkeleton />
    </div>
  );
};
