import type { ListProps } from "./list.types";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Card, Checkbox, Label, SearchInput, Skeleton } from "@/web/components/ui";

import { getItemDisplay, getItemKey, searchInItem } from "./list.utils";

// Sortable Item component (used when reorderEnabled=true)
function SortableItem<T>({
  item,
  index,
  itemKey,
  disabled,
  isSelected,
  isHovered,
  itemClassName,
  hoveredItemClassName,
  disabledItemClassName,
  showSelectionControls,
  selectionMode,
  itemTemplate,
  displayExpr,
  onItemClick,
  onItemContextMenu,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  handleItemSelection,
}: {
  item: T;
  index: number;
  itemKey: string | number | T;
  disabled: boolean;
  isSelected: boolean;
  isHovered: boolean;
  itemClassName: string | ((params: { itemData: T; itemIndex: number; itemKey: string | number | T }) => string);
  hoveredItemClassName: string;
  disabledItemClassName: string;
  showSelectionControls: boolean;
  selectionMode: "single" | "multiple" | "none";
  itemTemplate?: ((params: { itemData: T; itemIndex: number; itemKey: string | number | T }) => React.ReactNode) | React.ReactNode;
  displayExpr: string | ((item: T) => string);
  onItemClick: (item: T, itemKey: string | number | T, index: number, event: React.MouseEvent) => void;
  onItemContextMenu?: (e: { item: T; itemData: T; itemIndex: number; itemKey: string | number | T; event: React.MouseEvent }) => void;
  onKeyDown: (event: React.KeyboardEvent, item: T, itemKey: string | number | T, index: number) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  handleItemSelection: (item: T, itemKey: string | number | T) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(itemKey), disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const itemClassNames = [
    "text-sm py-3 border-b last:border-b-0 group flex gap-2 px-4 transition-all",
    !disabled ? "cursor-pointer" : "",
    typeof itemClassName === "function"
      ? itemClassName({ itemData: item, itemIndex: index, itemKey })
      : itemClassName,
    isHovered ? hoveredItemClassName : "",
    disabled ? disabledItemClassName : "",
  ].filter(Boolean).join(" ");

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={itemClassNames}
      onClick={e => onItemClick(item, itemKey, index, e)}
      onContextMenu={(e) => {
        onItemContextMenu?.({
          item,
          itemData: item,
          itemIndex: index,
          itemKey,
          event: e,
        });
      }}
      onKeyDown={e => onKeyDown(e, item, itemKey, index)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={disabled ? -1 : 0}
      role="option"
      aria-selected={isSelected}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center opacity-50 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical size={18} />
      </div>
      {showSelectionControls && selectionMode !== "none" && (
        <Checkbox
          className="mt-0.5"
          checked={isSelected}
          disabled={disabled}
          onCheckedChange={() => !disabled && handleItemSelection(item, itemKey)}
        />
      )}
      <div className="flex items-center gap-2 justify-between w-full">
        <Label
          className={`text-sm w-full ${!disabled ? "cursor-pointer" : ""} ${disabled ? "text-muted-foreground" : ""}`}
        >
          {itemTemplate
            ? (
                typeof itemTemplate === "function"
                  ? (
                      itemTemplate({ itemData: item, itemIndex: index, itemKey })
                    )
                  : (
                      itemTemplate
                    )
              )
            : (
                getItemDisplay(item, displayExpr)
              )}
        </Label>
      </div>
    </li>
  );
}

export const List = <T,>({
  // Core Props
  dataSource = [],
  keyExpr = "id",
  displayExpr = "text",
  disabled = false,
  visible = true,
  height = "auto",
  width = "100%",

  // Selection Props
  selectionMode = "single",
  selectedItems,
  selectedItemKeys,
  showSelectionControls = false,
  selectByClick = true,

  // Display Props
  itemTemplate,
  noDataText = "No data to display",
  searchEnabled = false,
  searchExpr = "",
  searchValue: controlledSearchValue,
  searchPlaceholder = "Search...",
  isSuccess = false,
  showSelectedItemsPills = true,

  // Reorder Props
  reorderEnabled = false,
  onItemReordered,

  // Infinite Scroll Props
  infiniteScrollEnabled = false,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  loadMoreText = "Load more",
  loadingMoreText = "Loading more...",

  // Styling Props
  className = "",
  itemClassName = "",
  hoveredItemClassName = "hover:bg-muted/50",
  disabledItemClassName = "opacity-50",

  // Event Handlers
  onSelectionChanged,
  onItemClick,
  onItemContextMenu,
  onSearchValueChanged,
}: Omit<ListProps<T>, "dataSource"> & { dataSource: T[] }) => {
  const [internalSearchValue, setInternalSearchValue] = useState("");
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<(string | number | T)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  const loadMoreRef = useRef<HTMLLIElement>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  const searchValue = controlledSearchValue !== undefined ? controlledSearchValue : internalSearchValue;
  const currentSelectedKeys = selectedItemKeys !== undefined ? selectedItemKeys : internalSelectedKeys;

  // Configure sensors for drag & drop (only if reorderEnabled)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement before starting drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms delay for touch (allows scrolling)
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Create selected items for pills display
  const selectedItemsForPills = useMemo(() => {
    if (!showSelectedItemsPills || selectionMode === "none") {
      return [];
    }

    // If selectedItems is provided (all selected items including those not in current dataSource),
    // use it directly for pills to show all selected items even if not yet loaded
    if (selectedItems && selectedItems.length > 0) {
      return selectedItems.map(item => ({
        key: String(getItemKey(item, keyExpr)),
        label: getItemDisplay(item, displayExpr),
      }));
    }

    // Fallback: search in dataSource (for backward compatibility)
    return currentSelectedKeys
      .map((key) => {
        const item = dataSource.find(data => getItemKey(data, keyExpr) === key);
        if (!item)
          return null;
        return {
          key: String(key),
          label: getItemDisplay(item, displayExpr),
        };
      })
      .filter(Boolean) as { key: string; label: string }[];
  }, [selectedItems, currentSelectedKeys, dataSource, keyExpr, displayExpr, showSelectedItemsPills, selectionMode]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchEnabled || !searchValue.trim() || onSearchValueChanged !== undefined) {
      return dataSource;
    }
    return dataSource.filter(item => searchInItem(item, searchValue, searchExpr));
  }, [dataSource, searchValue, searchEnabled, searchExpr, onSearchValueChanged]);

  const handleSearchChange = useCallback((value: string) => {
    if (controlledSearchValue === undefined) {
      setInternalSearchValue(value);
    }
    onSearchValueChanged?.(value);
  }, [controlledSearchValue, onSearchValueChanged]);

  const handleItemSelection = useCallback((item: T, itemKey: string | number | T) => {
    if (selectionMode === "none" || disabled)
      return;

    let newSelectedKeys: (string | number | T)[];
    let addedItems: T[] = [];
    let removedItems: T[] = [];

    if (selectionMode === "single") {
      if (currentSelectedKeys.includes(itemKey)) {
        newSelectedKeys = [];
        removedItems = [item];
      }
      else {
        newSelectedKeys = [itemKey];
        addedItems = [item];
        if (currentSelectedKeys.length > 0) {
          const prevSelectedItem = dataSource.find(data =>
            getItemKey(data, keyExpr) === currentSelectedKeys[0],
          );
          if (prevSelectedItem)
            removedItems = [prevSelectedItem];
        }
      }
    }
    else if (selectionMode === "multiple") {
      if (currentSelectedKeys.includes(itemKey)) {
        newSelectedKeys = currentSelectedKeys.filter(key => key !== itemKey);
        removedItems = [item];
      }
      else {
        newSelectedKeys = [...currentSelectedKeys, itemKey];
        addedItems = [item];
      }
    }
    else {
      return;
    }

    if (selectedItemKeys === undefined) {
      setInternalSelectedKeys(newSelectedKeys);
    }

    // Build selectedItemsArray from both dataSource and selectedItems to ensure
    // all selected items are returned, including those not yet loaded in dataSource
    const selectedItemsArray: T[] = [];
    const allAvailableItems = [...dataSource];

    // Add items from selectedItems that are not in dataSource
    if (selectedItems) {
      selectedItems.forEach((item) => {
        const itemKey = getItemKey(item, keyExpr);
        if (!dataSource.some(d => getItemKey(d, keyExpr) === itemKey)) {
          allAvailableItems.push(item);
        }
      });
    }

    // Filter all available items by the new selected keys
    newSelectedKeys.forEach((key) => {
      const item = allAvailableItems.find(data => getItemKey(data, keyExpr) === key);
      if (item) {
        selectedItemsArray.push(item);
      }
    });

    onSelectionChanged?.({
      addedItems,
      removedItems,
      selectedItems: selectedItemsArray,
      selectedItemKeys: newSelectedKeys,
    });
  }, [selectionMode, disabled, currentSelectedKeys, dataSource, selectedItems, keyExpr, selectedItemKeys, onSelectionChanged]);

  // Handle removing selected items via pills
  const handleRemoveSelectedItem = useCallback((itemKey: string | number) => {
    // Find the item by comparing string representation of keys
    // First try to find in dataSource, then in selectedItems (for items not yet loaded)
    let item = dataSource.find(data => String(getItemKey(data, keyExpr)) === String(itemKey));

    if (!item && selectedItems) {
      item = selectedItems.find(data => String(getItemKey(data, keyExpr)) === String(itemKey));
    }

    if (item) {
      handleItemSelection(item, getItemKey(item, keyExpr));
    }
  }, [dataSource, selectedItems, keyExpr, handleItemSelection]);

  const handleItemClick = useCallback((item: T, itemKey: string | number | T, index: number, event: React.MouseEvent) => {
    if (disabled)
      return;

    if (selectByClick && showSelectionControls) {
      handleItemSelection(item, itemKey);
      return;
    }

    onItemClick?.({
      item,
      itemData: item,
      itemIndex: index,
      itemKey,
      event,
    });
  }, [disabled, onItemClick, selectByClick, showSelectionControls, handleItemSelection]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent, item: T, itemKey: string | number | T, index: number) => {
    if (disabled)
      return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (showSelectionControls) {
          handleItemSelection(item, itemKey);
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        setHoveredIndex(Math.min(dataSource.length - 1, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHoveredIndex(Math.max(0, index - 1));
        break;
    }
  }, [disabled, showSelectionControls, handleItemSelection, dataSource.length]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (!reorderEnabled || disabled)
      return;

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = filteredData.findIndex(item => String(getItemKey(item, keyExpr)) === active.id);
    const newIndex = filteredData.findIndex(item => String(getItemKey(item, keyExpr)) === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const newDataSource = arrayMove(filteredData, oldIndex, newIndex);

    onItemReordered?.({
      item: filteredData[oldIndex],
      fromIndex: oldIndex,
      toIndex: newIndex,
      reorderedItems: newDataSource,
    });
  }, [reorderEnabled, disabled, filteredData, keyExpr, onItemReordered]);

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

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`flex flex-col gap-2 ${className}`}
    >
      {searchEnabled && (
        <SearchInput
          onChange={handleSearchChange}
          onRemoveItem={handleRemoveSelectedItem}
          placeholder={searchPlaceholder}
          selectedItems={selectedItemsForPills}
          showSelectedItems={showSelectedItemsPills}
          value={searchValue}
        />
      )}
      <Card style={{ height, width }} className="overflow-auto">
        {!isSuccess
          ? (
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
            )
          : filteredData.length === 0
            ? (
                <div className="p-4 text-center text-muted-foreground pt-12">
                  <p className="text-sm">
                    {noDataText}
                  </p>
                </div>
              )
            : reorderEnabled
              ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={filteredData.map(item => String(getItemKey(item, keyExpr)))}
                      strategy={verticalListSortingStrategy}
                      disabled={disabled}
                    >
                      <ul className="flex flex-col">
                        {filteredData.map((item, index) => {
                          const itemKey = getItemKey(item, keyExpr);
                          const isSelected = currentSelectedKeys.includes(itemKey);
                          const isHovered = hoveredIndex === index;

                          return (
                            <SortableItem
                              key={String(itemKey)}
                              item={item}
                              index={index}
                              itemKey={itemKey}
                              disabled={disabled}
                              isSelected={isSelected}
                              isHovered={isHovered}
                              itemClassName={itemClassName}
                              hoveredItemClassName={hoveredItemClassName}
                              disabledItemClassName={disabledItemClassName}
                              showSelectionControls={showSelectionControls}
                              selectionMode={selectionMode}
                              itemTemplate={itemTemplate}
                              displayExpr={displayExpr}
                              onItemClick={handleItemClick}
                              onItemContextMenu={onItemContextMenu}
                              onKeyDown={handleKeyDown}
                              onMouseEnter={() => setHoveredIndex(index)}
                              onMouseLeave={() => setHoveredIndex(-1)}
                              handleItemSelection={handleItemSelection}
                            />
                          );
                        })}

                        {/* Infinite scroll trigger */}
                        {infiniteScrollEnabled && hasNextPage && (
                          <li
                            ref={loadMoreRef}
                            className="px-2 py-4 text-center border-t"
                          >
                            <button
                              type="button"
                              onClick={onLoadMore}
                              disabled={isFetchingNextPage}
                              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors cursor-pointer"
                            >
                              {isFetchingNextPage ? loadingMoreText : loadMoreText}
                            </button>
                          </li>
                        )}
                      </ul>
                    </SortableContext>
                  </DndContext>
                )
              : (
                  <ul className="flex flex-col">
                    {filteredData.map((item, index) => {
                      const itemKey = getItemKey(item, keyExpr);
                      const isSelected = currentSelectedKeys.includes(itemKey);
                      const isHovered = hoveredIndex === index;

                      const itemClassNames = [
                        "text-sm py-3 border-b last:border-b-0 group flex gap-2 px-4 transition-all",
                        !disabled ? "cursor-pointer" : "",
                        typeof itemClassName === "function"
                          ? itemClassName({ itemData: item, itemIndex: index, itemKey })
                          : itemClassName,
                        isHovered ? hoveredItemClassName : "",
                        disabled ? disabledItemClassName : "",
                      ].filter(Boolean).join(" ");

                      return (
                        <li
                          key={String(itemKey)}
                          className={itemClassNames}
                          onClick={e => handleItemClick(item, itemKey, index, e)}
                          onContextMenu={(e) => {
                            onItemContextMenu?.({
                              item,
                              itemData: item,
                              itemIndex: index,
                              itemKey,
                              event: e,
                            });
                          }}
                          onKeyDown={e => handleKeyDown(e, item, itemKey, index)}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(-1)}
                          tabIndex={disabled ? -1 : 0}
                          role="option"
                          aria-selected={isSelected}
                        >
                          {showSelectionControls && selectionMode !== "none" && (
                            <Checkbox
                              className="mt-0.5"
                              checked={isSelected}
                              disabled={disabled}
                              onCheckedChange={() => !disabled && handleItemSelection(item, itemKey)}
                            />
                          )}
                          <div className="flex items-center gap-2 justify-between w-full">
                            <Label
                              className={`text-sm w-full ${!disabled ? "cursor-pointer" : ""} ${disabled ? "text-muted-foreground" : ""}`}
                            >
                              {itemTemplate
                                ? (
                                    typeof itemTemplate === "function"
                                      ? (
                                          itemTemplate({ itemData: item, itemIndex: index, itemKey })
                                        )
                                      : (
                                          itemTemplate
                                        )
                                  )
                                : (
                                    getItemDisplay(item, displayExpr)
                                  )}
                            </Label>
                          </div>
                        </li>
                      );
                    })}

                    {/* Infinite scroll trigger */}
                    {infiniteScrollEnabled && hasNextPage && (
                      <li
                        ref={loadMoreRef}
                        className="px-2 py-4 text-center border-t"
                      >
                        <button
                          type="button"
                          onClick={onLoadMore}
                          disabled={isFetchingNextPage}
                          className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          {isFetchingNextPage ? loadingMoreText : loadMoreText}
                        </button>
                      </li>
                    )}
                  </ul>
                )}
      </Card>
    </div>
  );
};
