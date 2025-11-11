import type { ListProps } from "../list.types";

import { useCallback } from "react";

import { Card, SearchInput } from "@/web/components/ui";

import { EmptyState, ListSkeleton, LoadMoreButton, RegularList, SortableList } from ".";
import {
  useInfiniteScroll,
  useListHandlers,
  useListHover,
  useListSearch,
  useListSelection,
  useSelectedItemsPills,
} from "../hooks";
import { getItemKey } from "../list.utils";

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
  // Custom hooks
  const { searchValue, filteredData, handleSearchChange } = useListSearch(
    searchEnabled,
    controlledSearchValue,
    dataSource,
    searchExpr,
    onSearchValueChanged,
  );

  const { currentSelectedKeys, handleItemSelection } = useListSelection(
    selectionMode,
    selectedItemKeys,
    selectedItems,
    dataSource,
    keyExpr,
    disabled,
    onSelectionChanged,
  );

  const { selectedItemsForPills } = useSelectedItemsPills(
    showSelectedItemsPills,
    selectionMode,
    selectedItems,
    currentSelectedKeys,
    dataSource,
    keyExpr,
    displayExpr,
  );

  const { hoveredIndex, setHoveredIndex } = useListHover();

  const { loadMoreRef } = useInfiniteScroll(
    infiniteScrollEnabled,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
  );

  const { handleItemClick, handleKeyDown, handleDragEnd } = useListHandlers(
    disabled,
    selectByClick,
    showSelectionControls,
    reorderEnabled,
    keyExpr,
    onItemClick,
    onItemReordered,
    handleItemSelection,
  );

  // Handle removing selected items via pills
  const handleRemoveSelectedItem = useCallback((itemKey: string | number) => {
    // Find the item by comparing string representation of keys
    let item = dataSource.find(data => String(getItemKey(data, keyExpr)) === String(itemKey));

    if (!item && selectedItems) {
      item = selectedItems.find(data => String(getItemKey(data, keyExpr)) === String(itemKey));
    }

    if (item) {
      handleItemSelection(item, getItemKey(item, keyExpr));
    }
  }, [dataSource, selectedItems, keyExpr, handleItemSelection]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
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
              <ListSkeleton showSelectionControls={showSelectionControls} />
            )
          : filteredData.length === 0
            ? (
                <EmptyState noDataText={noDataText} />
              )
            : (
                <>
                  {reorderEnabled
                    ? (
                        <SortableList
                          filteredData={filteredData}
                          currentSelectedKeys={currentSelectedKeys}
                          hoveredIndex={hoveredIndex}
                          setHoveredIndex={setHoveredIndex}
                          keyExpr={keyExpr}
                          disabled={disabled}
                          itemClassName={itemClassName}
                          hoveredItemClassName={hoveredItemClassName}
                          disabledItemClassName={disabledItemClassName}
                          showSelectionControls={showSelectionControls}
                          selectionMode={selectionMode}
                          itemTemplate={itemTemplate}
                          displayExpr={displayExpr}
                          handleItemClick={handleItemClick}
                          onItemContextMenu={onItemContextMenu}
                          handleKeyDown={handleKeyDown}
                          handleItemSelection={handleItemSelection}
                          onDragEnd={event => handleDragEnd(event, filteredData)}
                        />
                      )
                    : (
                        <RegularList
                          filteredData={filteredData}
                          currentSelectedKeys={currentSelectedKeys}
                          hoveredIndex={hoveredIndex}
                          setHoveredIndex={setHoveredIndex}
                          keyExpr={keyExpr}
                          disabled={disabled}
                          itemClassName={itemClassName}
                          hoveredItemClassName={hoveredItemClassName}
                          disabledItemClassName={disabledItemClassName}
                          showSelectionControls={showSelectionControls}
                          selectionMode={selectionMode}
                          itemTemplate={itemTemplate}
                          displayExpr={displayExpr}
                          handleItemClick={handleItemClick}
                          onItemContextMenu={onItemContextMenu}
                          handleKeyDown={handleKeyDown}
                          handleItemSelection={handleItemSelection}
                        />
                      )}

                  {/* Infinite scroll trigger */}
                  {infiniteScrollEnabled && hasNextPage && (
                    <LoadMoreButton
                      loadMoreRef={loadMoreRef}
                      onLoadMore={onLoadMore}
                      isFetchingNextPage={isFetchingNextPage}
                      loadMoreText={loadMoreText}
                      loadingMoreText={loadingMoreText}
                    />
                  )}
                </>
              )}
      </Card>
    </div>
  );
};
