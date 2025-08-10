import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import React from "react";

import { Input, Label } from "@/web/components/ui";
import { cn } from "@/web/lib/cn";

type FormFieldProps = {
  label: string;
  id?: string;
  type?: string;
  placeholder?: string;
  error?: FieldError;
  register: UseFormRegisterReturn;
  className?: string;
  children?: React.ReactNode;
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  type = "text",
  placeholder,
  error,
  register,
  className,
  children,
}) => {
  const inputProps = {
    id: id || "",
    type,
    placeholder,
    ...register,
    className: cn(error ? "outline-red-500  focus-visible:ring-red-500" : "", className),
  };

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="px-3">
        {label}
      </Label>
      {children
        ? (
            // eslint-disable-next-line react/no-clone-element
            React.cloneElement(children as React.ReactElement, inputProps)
          )
        : (
            <Input {...inputProps} />
          )}
      {error && <p className="text-sm text-red-500 px-3">{error.message}</p>}
    </div>
  );
};
