import { MinusIcon, PlusIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/web/components/ui/button";
import { cn } from "@/web/lib/cn";

type IncrementInputProps = {
  value: string;
  onChange: (value: string) => void;
  step?: number;
  min?: number;
  max?: number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  type?: "number";
};

const IncrementInput = (
  { ref, value, onChange, step = 1, min = 0, max, placeholder, className, disabled, type = "number", ...props }: IncrementInputProps & { ref?: React.RefObject<HTMLInputElement | null> },
) => {
  const numericValue = Number.parseFloat(value) || 0;

  // Determine if we should show 4 buttons (for decimal steps) or 2 buttons (for integer steps)
  const showAdvancedButtons = step !== 1 && step % 1 !== 0;

  // Calculate different step values for advanced mode
  const smallStep = step;
  const largeStep = step * 2;

  const handleIncrement = (incrementStep: number) => {
    const newValue = numericValue + incrementStep;
    if (max === undefined || newValue <= max) {
      onChange(newValue.toString());
    }
  };

  const handleDecrement = (decrementStep: number) => {
    const newValue = numericValue - decrementStep;
    if (newValue >= min) {
      onChange(newValue.toString());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  if (showAdvancedButtons) {
    return (
      <div className={cn("flex items-center", className)}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10  rounded-r-none border-r-0 px-0 w-14 text-xs gap-1"
          onClick={() => handleDecrement(largeStep)}
          disabled={disabled || numericValue - largeStep < min}
        >
          <MinusIcon className="size-3" />
          <span className="mt-0.5">5</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10  rounded-none border-r-0 px-0 w-14 text-xs gap-1"
          onClick={() => handleDecrement(smallStep)}
          disabled={disabled || numericValue - smallStep < min}
        >
          <MinusIcon className="size-3" />
          <span className="mt-0.5">2.5</span>
        </Button>
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex h-10 w-full border border-input bg-background px-3 py-2 text-sm text-center ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-none border-x-0",
            // Hide number input arrows
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
            className,
          )}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-none border-l-0 px-0 w-14 text-xs gap-1"
          onClick={() => handleIncrement(smallStep)}
          disabled={disabled || (max !== undefined && numericValue + smallStep > max)}
        >
          <PlusIcon className="size-3" />
          <span className="mt-0.5">2.5</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-l-none border-l-0 px-0 w-14 text-xs gap-1"
          onClick={() => handleIncrement(largeStep)}
          disabled={disabled || (max !== undefined && numericValue + largeStep > max)}
        >
          <PlusIcon className="size-3" />
          <span className="mt-0.5">5</span>
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 w-10 rounded-r-none border-r-0 px-0 text-xs gap-1"
        onClick={() => handleDecrement(step)}
        disabled={disabled || numericValue <= min}
      >
        <MinusIcon className="size-3" />
      </Button>
      <input
        ref={ref}
        type={type}
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full border border-input bg-background px-3 py-2 text-sm text-center ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-none border-x-0",
          // Hide number input arrows
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className,
        )}
        {...props}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-10 w-10 rounded-l-none border-l-0 px-0 text-xs gap-1"
        onClick={() => handleIncrement(step)}
        disabled={disabled || (max !== undefined && numericValue >= max)}
      >
        <PlusIcon className="size-3" />
      </Button>
    </div>
  );
};

IncrementInput.displayName = "IncrementInput";

export { IncrementInput };
