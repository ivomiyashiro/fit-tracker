import type { RefObject } from "react";

import { useCallback, useEffect, useRef, useState } from "react";

type UseInfiniteScrollOptions = {
  itemHeight: number;
  containerHeight: number;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  threshold?: number;
  bufferSize?: number;
};

type UseInfiniteScrollReturn<T> = {
  containerRef: RefObject<HTMLDivElement | null>;
  loadMoreRef: RefObject<HTMLDivElement | null>;
  startIndex: number;
  endIndex: number;
  visibleItems: T[];
  totalHeight: number;
  offsetY: number;
  handleScroll: () => void;
};

export const useInfiniteScroll = <T>(
  items: T[],
  options: UseInfiniteScrollOptions,
): UseInfiniteScrollReturn<T> => {
  const {
    itemHeight,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    threshold = 0.1,
    bufferSize = 5,
  } = options;

  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!containerRef.current)
      return;

    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    const newEndIndex = Math.min(
      newStartIndex + Math.ceil(clientHeight / itemHeight) + bufferSize,
      items.length,
    );

    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);

    if (scrollTop + clientHeight >= scrollHeight - 100 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [containerRef, itemHeight, bufferSize, items, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container)
      return;

    container.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage, isFetchingNextPage, threshold]);

  const visibleItems = items.slice(startIndex, endIndex);
  const totalHeight = items.length * itemHeight + (hasNextPage ? itemHeight : 0);
  const offsetY = startIndex * itemHeight;

  return {
    containerRef,
    loadMoreRef,
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  };
};
