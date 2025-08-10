import { Loader2 } from "lucide-react";

import { cn } from "@/web/lib/cn";

export const Spinner = ({ className }: { className?: string }) => {
  return <Loader2 className={cn("animate-spin", className)} />;
};
