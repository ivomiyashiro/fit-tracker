import { Skeleton } from "@/web/components/ui";

type ListSkeletonProps = {
  showSelectionControls: boolean;
};

export function ListSkeleton({ showSelectionControls }: ListSkeletonProps) {
  return (
    <div className="flex flex-col">
      {Array.from({ length: 5 }).map((_, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i} className="flex gap-2.5 border-b last:border-b-0 px-4 py-3 h-[68px]">
          {showSelectionControls && (
            <Skeleton className="h-4 w-4 rounded" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
