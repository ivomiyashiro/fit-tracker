import { useCallback, useMemo, useState } from "react";

import { Card, Checkbox, Label, SearchInput } from "@/web/components/ui";

import type { ListProps } from "./list.types";

import { getItemDisplay, getItemKey, searchInItem } from "./list.utils";

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

  // Legacy props
  title,
}: Omit<ListProps<T>, "dataSource"> & { dataSource: T[] }) => {
  // Internal state for search
  const [internalSearchValue, setInternalSearchValue] = useState("");

  // Internal state for selection
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<(string | number | T)[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  // Use controlled or internal search value
  const searchValue = controlledSearchValue !== undefined ? controlledSearchValue : internalSearchValue;

  // Use controlled or internal selected keys
  const currentSelectedKeys = selectedItemKeys !== undefined ? selectedItemKeys : internalSelectedKeys;

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchEnabled || !searchValue.trim()) {
      return dataSource;
    }
    return dataSource.filter(item => searchInItem(item, searchValue, searchExpr));
  }, [dataSource, searchValue, searchEnabled, searchExpr]);

  // Handle search value change
  const handleSearchChange = useCallback((value: string) => {
    if (controlledSearchValue === undefined) {
      setInternalSearchValue(value);
    }
    onSearchValueChanged?.(value);
  }, [controlledSearchValue, onSearchValueChanged]);

  // Handle item selection
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

    const selectedItemsArray = dataSource.filter(data =>
      newSelectedKeys.includes(getItemKey(data, keyExpr)),
    );

    onSelectionChanged?.({
      addedItems,
      removedItems,
      selectedItems: selectedItemsArray,
      selectedItemKeys: newSelectedKeys,
    });
  }, [selectionMode, disabled, currentSelectedKeys, dataSource, keyExpr, selectedItemKeys, onSelectionChanged]);

  // Handle item click
  const handleItemClick = useCallback((item: T, itemKey: string | number | T, index: number, event: React.MouseEvent) => {
    if (disabled)
      return;

    // If selection controls are shown and selectByClick is true, prioritize selection over navigation
    if (selectByClick && showSelectionControls) {
      handleItemSelection(item, itemKey);
      return; // Don't trigger onItemClick when selecting
    }

    // Only trigger navigation/item click when not in selection mode
    onItemClick?.({
      item,
      itemData: item,
      itemIndex: index,
      itemKey,
      event,
    });
  }, [disabled, onItemClick, selectByClick, showSelectionControls, handleItemSelection]);

  // Handle keyboard navigation
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
        setHoveredIndex(Math.min(filteredData.length - 1, index + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHoveredIndex(Math.max(0, index - 1));
        break;
    }
  }, [disabled, showSelectionControls, handleItemSelection, filteredData.length]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`flex flex-col gap-2 ${className}`}
      style={{ height, width }}
    >
      {title && <Label className="px-3">{title}</Label>}

      {searchEnabled && (
        <div className="px-3">
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>
      )}

      <Card>
        <div className="overflow-auto">
          {filteredData.length === 0
            ? (
                <div className="p-4 text-center text-muted-foreground">
                  {noDataText}
                </div>
              )
            : (
                <ul className="flex flex-col py-2 px-4">
                  {filteredData.map((item, index) => {
                    const itemKey = getItemKey(item, keyExpr);
                    const isSelected = currentSelectedKeys.includes(itemKey);
                    const isHovered = hoveredIndex === index;

                    const itemClassNames = [
                      "text-sm py-2 border-b last:border-b-0 group flex gap-2",
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
                </ul>
              )}
        </div>
      </Card>
    </div>
  );
};
