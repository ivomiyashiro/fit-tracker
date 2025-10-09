import { SearchIcon, X } from "lucide-react";

import { Badge, Input, Spinner } from "@/web/components/ui";

type SelectedItem = {
  key: string | number;
  label: string;
};

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  selectedItems?: SelectedItem[];
  onRemoveItem?: (itemKey: string | number) => void;
  showSelectedItems?: boolean;
};

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  isLoading = false,
  selectedItems = [],
  onRemoveItem,
  showSelectedItems = false,
}: SearchInputProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {showSelectedItems && selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedItems.map(item => (
            <Badge
              key={item.key}
              variant="secondary"
              className="flex items-center gap-1 text-xs"
            >
              {item.label}
              {onRemoveItem && (
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.key)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
                  aria-label={`Remove ${item.label}`}
                >
                  <X className="size-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
      {/* Search input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="pl-10"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Spinner className="size-4" />
          </div>
        )}
      </div>
    </div>
  );
};

SearchInput.displayName = "SearchInput";
