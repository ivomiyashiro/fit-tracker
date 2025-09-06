import { DumbbellIcon } from "lucide-react";

export const AppFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <div className="relative">
        <DumbbellIcon className="size-16 text-primary animate-bounce" />
        <div className="absolute inset-0 -z-10 rounded-full bg-primary/20 animate-ping" />
        <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 animate-pulse" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-2xl font-bold animate-pulse">Fit Tracker</span>
        <span className="text-muted-foreground">Getting your workout ready...</span>
      </div>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
      </div>
    </div>
  );
};
