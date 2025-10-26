import type { ReactNode } from "react";

export type SelectionChangedEvent<T> = {
  addedItems: T[];
  removedItems: T[];
  selectedItems: T[];
  selectedItemKeys: (string | number | T)[];
};

export type ItemClickEvent<T> = {
  item: T;
  itemData: T;
  itemIndex: number;
  itemKey: string | number | T;
  event: React.MouseEvent;
};

export type ItemContextMenuEvent<T> = {
  item: T;
  itemData: T;
  itemIndex: number;
  itemKey: string | number | T;
  event: React.MouseEvent;
};

export type ItemDeletingEvent<T> = {
  item: T;
  itemData: T;
  itemIndex: number;
  itemKey: string | number | T;
  cancel: boolean;
};

export type ItemDeletedEvent<T> = {
  item: T;
  itemData: T;
  itemIndex: number;
  itemKey: string | number | T;
};

export type ItemReorderedEvent<T> = {
  item: T;
  fromIndex: number;
  toIndex: number;
  reorderedItems: T[];
};

export type ItemRenderedEvent<T> = {
  item: T;
  itemData: T;
  itemIndex: number;
  itemKey: string | number | T;
};

export type ScrollEvent = {
  scrollTop: number;
  scrollLeft: number;
  reachedTop: boolean;
  reachedBottom: boolean;
  reachedLeft: boolean;
  reachedRight: boolean;
};

export type ListProps<T> = {
  // Core Props
  dataSource?: T[];
  keyExpr?: string | ((item: T) => string | number | T);
  displayExpr?: string | ((item: T) => string);
  disabled?: boolean;
  visible?: boolean;
  height?: number | string;
  width?: number | string;

  // Selection Props
  selectionMode?: "single" | "multiple" | "none";
  selectedItems?: T[];
  selectedItemKeys?: (string | number | T)[];
  showSelectionControls?: boolean;
  selectByClick?: boolean;

  // Display Props
  itemTemplate?: ((params: { itemData: T; itemIndex: number; itemKey: string | number | T }) => ReactNode) | ReactNode;
  noDataText?: string;
  searchEnabled?: boolean;
  searchExpr?: string | string[];
  searchValue?: string;
  searchPlaceholder?: string;
  isSuccess?: boolean;
  showSelectedItemsPills?: boolean;

  // Reorder Props
  reorderEnabled?: boolean;
  onItemReordered?: (e: ItemReorderedEvent<T>) => void;

  // Infinite Scroll Props
  infiniteScrollEnabled?: boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  loadMoreText?: string;
  loadingMoreText?: string;

  // Styling Props
  className?: string;
  itemClassName?: string | ((params: { itemData: T; itemIndex: number; itemKey: string | number | T }) => string);
  selectedItemClassName?: string;
  hoveredItemClassName?: string;
  disabledItemClassName?: string;

  // Event Handlers
  onSelectionChanged?: (e: SelectionChangedEvent<T>) => void;
  onItemClick?: (e: ItemClickEvent<T>) => void;
  onItemContextMenu?: (e: ItemContextMenuEvent<T>) => void;
  onSearchValueChanged?: (searchValue: string) => void;
};
