import { Badge } from "@/web/components/ui/badge";
import { cn } from "@/web/lib/cn";

type Props = {
  className?: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
};

export const SetBadge = ({
  className,
  icon,
  label,
  value,
  unit,
}: Props) => {
  return (
    <div className="flex gap-2 items-center mt-0.5">
      <Badge variant="outline" className={cn("text-xs px-2.5 py-1.5", className)}>
        {icon}
        <span className="text-xs mt-0.5">
          {label}
          :
          {value}
          {" "}
          {unit && `${unit}`}
        </span>
      </Badge>
    </div>
  );
};
