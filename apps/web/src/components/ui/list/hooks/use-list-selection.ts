import type { SelectionChangedEvent } from "../list.types";

import { useCallback, useState } from "react";

import { getItemKey } from "../list.utils";

export function useListSelection<T>(
  selectionMode: "single" | "multiple" | "none",
  selectedItemKeys: (string | number | T)[] | undefined,
  selectedItems: T[] | undefined,
  dataSource: T[],
  keyExpr: string | ((item: T) => string | number | T),
  disabled: boolean,
  onSelectionChanged?: (e: SelectionChangedEvent<T>) => void,
) {
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<(string | number | T)[]>([]);
  const currentSelectedKeys = selectedItemKeys !== undefined ? selectedItemKeys : internalSelectedKeys;

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

  return {
    currentSelectedKeys,
    handleItemSelection,
  };
}
