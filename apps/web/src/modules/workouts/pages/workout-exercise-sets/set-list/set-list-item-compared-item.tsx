import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

import { cn } from "@/web/lib/cn";

type ComparisonMetric = {
    label: string;
    current: number;
    previous: number;
    unit?: string;
    showPercentage?: boolean;
    lowerIsBetter?: boolean;
    decimalPlaces?: number;
};

export const ComparisonItem = ({ label, current, previous, unit = "", showPercentage = true, lowerIsBetter = false, decimalPlaces = 0 }: ComparisonMetric) => {
    const difference = current - previous;
    const percentageChange = previous !== 0 ? ((difference / previous) * 100) : 0;
    const isNeutral = difference === 0;

    // For metrics where lower is better (like RIR), invert the logic
    const isImprovement = lowerIsBetter ? difference < 0 : difference > 0;
    const isPositive = difference > 0;

    const getIcon = () => {
        if (isNeutral)
            return <MinusIcon className="w-3 h-3" />;
        return isPositive ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />;
    };

    const getColorClass = () => {
        if (isNeutral)
            return "text-muted-foreground";
        return isImprovement ? "text-green-500" : "text-red-500";
    };

    const formatNumber = (num: number) => num.toFixed(decimalPlaces);

    return (
        <div className="flex flex-col gap-1 p-3 bg-secondary/30 rounded-md">
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
            <div className="flex items-baseline gap-1.5 flex-col">
                <span className="text-lg font-semibold">
                    {formatNumber(current)}
                    {unit}
                </span>
                <div className={cn("flex items-center gap-0.5 text-xs font-medium", getColorClass())}>
                    {getIcon()}
                    <span>
                        {formatNumber(Math.abs(difference))}
                        {unit}
                    </span>
                    {showPercentage && percentageChange !== 0 && (
                        <span>
                            (
                            {isPositive ? "+" : ""}
                            {percentageChange.toFixed(0)}
                            %)
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
