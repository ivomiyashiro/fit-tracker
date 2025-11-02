import type { RefObject } from "react";

import { Spinner } from "@/web/components/ui";

type LoadMoreButtonProps = {
  loadMoreRef: RefObject<HTMLLIElement | null>;
  onLoadMore?: () => void;
  isFetchingNextPage: boolean;
  loadMoreText: string;
  loadingMoreText: string;
};

export function LoadMoreButton({
  loadMoreRef,
  onLoadMore,
  isFetchingNextPage,
  loadMoreText,
  loadingMoreText,
}: LoadMoreButtonProps) {
  return (
    <li
      ref={loadMoreRef}
      className="px-2 py-4 text-center"
    >
      <button
        type="button"
        onClick={onLoadMore}
        disabled={isFetchingNextPage}
        className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-2 justify-center w-full"
      >
        <Spinner className="h-4" />
        {isFetchingNextPage ? loadingMoreText : loadMoreText}
      </button>
    </li>
  );
}
