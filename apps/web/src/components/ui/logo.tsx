import { useNavigate } from "@tanstack/react-router";
import { DumbbellIcon } from "lucide-react";

import { cn } from "@/web/lib/cn";

export const Logo = ({
  asLink = false,
  className,
  to = "/",
}: {
  asLink?: boolean;
  className?: string;
  to?: string;
}) => {
  const navigate = useNavigate();

  return (
    <div
      className={cn(
        `inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full p-3 w-10 h-10 ${asLink ? "cursor-pointer" : ""}`,
        className,
      )}
      onClick={() => (asLink ? navigate({ to }) : null)}
    >
      <DumbbellIcon className="w-full h-full" />
    </div>
  );
};
