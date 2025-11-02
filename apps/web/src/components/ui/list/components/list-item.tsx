import type { ListItemProps } from "../list.types";

import { Checkbox, Label } from "@/web/components/ui";

import { getItemDisplay } from "../list.utils";

export function ListItem<T>({
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
}: ListItemProps<T>) {
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
