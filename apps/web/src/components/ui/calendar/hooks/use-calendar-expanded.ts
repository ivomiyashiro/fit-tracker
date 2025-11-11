import { useState } from "react";

export function useCalendarExpanded(defaultExpanded: boolean = false) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  return {
    isExpanded,
    setIsExpanded,
    toggleExpanded,
  };
}
