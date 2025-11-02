import type { DragEndEvent } from "@dnd-kit/core";
import type { ItemClickEvent, ItemReorderedEvent } from "../list.types";

import { arrayMove } from "@dnd-kit/sortable";
import { useCallback } from "react";

import { getItemKey } from "../list.utils";

export function useListHandlers<T>(
  disabled: boolean,
  selectByClick: boolean,
  showSelectionControls: boolean,
  reorderEnabled: boolean,
  keyExpr: string | ((item: T) => string | number | T),
  onItemClick?: (e: ItemClickEvent<T>) => void,
  onItemReordered?: (e: ItemReorderedEvent<T>) => void,
  handleItemSelection?: (item: T, itemKey: string | number | T) => void,
) {
  const handleItemClick = useCallback((item: T, itemKey: string | number | T, index: number, event: React.MouseEvent) => {
    if (disabled)
      return;

    if (selectByClick && showSelectionControls && handleItemSelection) {
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

  const handleKeyDown = useCallback((event: React.KeyboardEvent, item: T, itemKey: string | number | T, _index: number) => {
    if (disabled)
      return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        if (showSelectionControls && handleItemSelection) {
          handleItemSelection(item, itemKey);
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        break;
      case "ArrowUp":
        event.preventDefault();
        break;
    }
  }, [disabled, showSelectionControls, handleItemSelection]);

  const handleDragEnd = useCallback((event: DragEndEvent, filteredData: T[]) => {
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
  }, [reorderEnabled, disabled, keyExpr, onItemReordered]);

  return {
    handleItemClick,
    handleKeyDown,
    handleDragEnd,
  };
}
