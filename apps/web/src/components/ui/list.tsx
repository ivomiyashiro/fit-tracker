import { type ReactNode, useRef } from "react";

import { Card, Checkbox, Label } from "@/web/components/ui";

export const EmptyState = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="flex flex-col gap-2 text-center items-center justify-center mt-40">
      <p className="text-2xl font-bold">{title}</p>
      <p className="text-lg text-muted-foreground">{description}</p>
    </div>
  );
};

export const ListItem = ({
  children,
  selectionEnabled = false,
  isSelected = false,
  onToggle,
  onClick,
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  selectionEnabled?: boolean;
  isSelected?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) => {
  const checkboxRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (disabled)
      return;

    if (selectionEnabled && onToggle) {
      checkboxRef.current?.click();
    }
    else if (onClick) {
      onClick();
    }
  };

  return (
    <li
      className={`text-sm py-2 border-b last:border-b-0 group flex gap-2 ${!disabled ? "cursor-pointer" : ""} ${className}`}
    >
      {selectionEnabled && (
        <Checkbox
          ref={checkboxRef}
          className="mt-0.5"
          checked={isSelected}
          disabled={disabled}
          onCheckedChange={() => !disabled && onToggle?.()}
        />
      )}
      <div className="flex items-center gap-2 justify-between w-full" onClick={handleClick}>
        <Label
          className={`text-sm w-full ${!disabled ? "cursor-pointer" : ""} ${disabled ? "text-muted-foreground" : ""}`}
        >
          {children}
        </Label>
      </div>
    </li>
  );
};

export const ListContainer = ({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="flex flex-col gap-2">
      {title && <Label className="px-3">{title}</Label>}
      <Card className={`flex flex-col gap-2 py-2 px-4 ${className}`}>{children}</Card>
    </div>
  );
};
