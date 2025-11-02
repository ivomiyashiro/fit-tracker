import { useMemo } from "react";

import { getItemDisplay, getItemKey } from "../list.utils";

export function useSelectedItemsPills<T>(
  showSelectedItemsPills: boolean,
  selectionMode: "single" | "multiple" | "none",
  selectedItems: T[] | undefined,
  currentSelectedKeys: (string | number | T)[],
  dataSource: T[],
  keyExpr: string | ((item: T) => string | number | T),
  displayExpr: string | ((item: T) => string),
) {
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

  return { selectedItemsForPills };
}
