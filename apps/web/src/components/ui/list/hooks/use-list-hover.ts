import { useState } from "react";

export function useListHover() {
  const [hoveredIndex, setHoveredIndex] = useState<number>(-1);

  return {
    hoveredIndex,
    setHoveredIndex,
  };
}
