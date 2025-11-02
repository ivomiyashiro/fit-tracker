import type { ItemContextMenuEvent } from "../list.types";

import { getItemKey } from "../list.utils";
import { ListItem } from "./list-item";

type RegularListProps<T> = {
  filteredData: T[];
  currentSelectedKeys: (string | number | T)[];
  hoveredIndex: number;
  setHoveredIndex: (index: number) => void;
  keyExpr: string | ((item: T) => string | number | T);
  disabled: boolean;
  itemClassName: string | ((params: { itemData: T; itemIndex: number; itemKey: string | number | T }) => string);
  hoveredItemClassName: string;
  disabledItemClassName: string;
  showSelectionControls: boolean;
  selectionMode: "single" | "multiple" | "none";
  itemTemplate?: ((params: { itemData: T; itemIndex: number; itemKey: string | number | T }) => React.ReactNode) | React.ReactNode;
  displayExpr: string | ((item: T) => string);
  handleItemClick: (item: T, itemKey: string | number | T, index: number, event: React.MouseEvent) => void;
  onItemContextMenu?: (e: ItemContextMenuEvent<T>) => void;
  handleKeyDown: (event: React.KeyboardEvent, item: T, itemKey: string | number | T, index: number) => void;
  handleItemSelection: (item: T, itemKey: string | number | T) => void;
};

export function RegularList<T>({
  filteredData,
  currentSelectedKeys,
  hoveredIndex,
  setHoveredIndex,
  keyExpr,
  disabled,
  itemClassName,
  hoveredItemClassName,
  disabledItemClassName,
  showSelectionControls,
  selectionMode,
  itemTemplate,
  displayExpr,
  handleItemClick,
  onItemContextMenu,
  handleKeyDown,
  handleItemSelection,
}: RegularListProps<T>) {
  return (
    <ul className="flex flex-col">
      {filteredData.map((item, index) => {
        const itemKey = getItemKey(item, keyExpr);
        const isSelected = currentSelectedKeys.includes(itemKey);
        const isHovered = hoveredIndex === index;

        return (
          <ListItem
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
    </ul>
  );
}
