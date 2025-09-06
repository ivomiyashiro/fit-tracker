export function getItemKey<T>(item: T, keyExpr: string | ((item: T) => string | number | T)): string | number | T {
  if (typeof keyExpr === "function") {
    return keyExpr(item);
  }
  if (typeof keyExpr === "string" && item && typeof item === "object" && keyExpr in item) {
    return (item as any)[keyExpr];
  }
  return item;
}

export function getItemDisplay<T>(item: T, displayExpr: string | ((item: T) => string)): string {
  if (typeof displayExpr === "function") {
    return displayExpr(item);
  }
  if (typeof displayExpr === "string" && item && typeof item === "object" && displayExpr in item) {
    return String((item as any)[displayExpr]);
  }
  return String(item);
}

export function searchInItem<T>(item: T, searchValue: string, searchExpr: string | string[] | null): boolean {
  if (!searchValue.trim())
    return true;

  const searchLower = searchValue.toLowerCase();

  if (!searchExpr) {
    return String(item).toLowerCase().includes(searchLower);
  }

  const fields = Array.isArray(searchExpr) ? searchExpr : [searchExpr];

  return fields.some((field) => {
    if (item && typeof item === "object" && field in item) {
      return String((item as any)[field]).toLowerCase().includes(searchLower);
    }
    return false;
  });
}
