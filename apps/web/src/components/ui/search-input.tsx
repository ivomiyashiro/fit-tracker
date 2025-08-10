import { SearchIcon } from "lucide-react";

import { Input } from "@/web/components/ui";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchInputProps) => {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};
