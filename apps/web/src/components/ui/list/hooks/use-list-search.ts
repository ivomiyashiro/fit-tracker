import { useCallback, useMemo, useState } from "react";

import { searchInItem } from "../list.utils";

export function useListSearch<T>(
  searchEnabled: boolean,
  controlledSearchValue: string | undefined,
  dataSource: T[],
  searchExpr: string | string[],
  onSearchValueChanged?: (value: string) => void,
) {
  const [internalSearchValue, setInternalSearchValue] = useState("");
  const searchValue = controlledSearchValue !== undefined ? controlledSearchValue : internalSearchValue;

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

  return {
    searchValue,
    filteredData,
    handleSearchChange,
  };
}
