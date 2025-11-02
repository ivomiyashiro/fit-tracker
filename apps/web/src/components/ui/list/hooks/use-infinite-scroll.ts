import { useEffect, useRef } from "react";

export function useInfiniteScroll(
  infiniteScrollEnabled: boolean,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  onLoadMore?: () => void,
) {
  const loadMoreRef = useRef<HTMLLIElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    if (!infiniteScrollEnabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage && onLoadMoreRef.current) {
          onLoadMoreRef.current();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [infiniteScrollEnabled, hasNextPage, isFetchingNextPage]);

  return { loadMoreRef };
}
