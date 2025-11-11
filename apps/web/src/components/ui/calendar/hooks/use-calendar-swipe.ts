import { useCallback, useEffect, useRef, useState } from "react";

import { addWeeks } from "../calendar.utils";

export function useCalendarSwipe(
  currentDate: Date,
  onDateChange: (date: Date) => void,
) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const prevDateRef = useRef<Date>(currentDate);

  const minSwipeDistance = 50;

  // Reset animation state after currentDate changes
  useEffect(() => {
    if (prevDateRef.current.getTime() !== currentDate.getTime() && isAnimating) {
      // Date changed, reset animation state
      setTranslateX(0);
      setIsAnimating(false);
    }
    // Always update ref to track current date
    prevDateRef.current = currentDate;
  }, [currentDate, isAnimating]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isAnimating)
return;

    touchEndX.current = e.touches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;

    // Apply drag effect with resistance
    const dragAmount = diff * 0.3;
    setTranslateX(dragAmount);
  }, [isAnimating]);

  const handleTouchEnd = useCallback(() => {
    if (isAnimating)
return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left = next week
      setIsAnimating(true);
      setTranslateX(-window.innerWidth);

      setTimeout(() => {
        onDateChange(addWeeks(currentDate, 1));
      }, 300);
    }
    else if (isRightSwipe) {
      // Swipe right = previous week
      setIsAnimating(true);
      setTranslateX(window.innerWidth);

      setTimeout(() => {
        onDateChange(addWeeks(currentDate, -1));
      }, 300);
    }
    else {
      // Snap back to original position
      setTranslateX(0);
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  }, [currentDate, onDateChange, isAnimating, minSwipeDistance]);

  const goToNextWeek = useCallback(() => {
    if (isAnimating)
return;

    setIsAnimating(true);
    setTranslateX(-window.innerWidth);

    setTimeout(() => {
      onDateChange(addWeeks(currentDate, 1));
    }, 300);
  }, [currentDate, onDateChange, isAnimating]);

  const goToPreviousWeek = useCallback(() => {
    if (isAnimating)
return;

    setIsAnimating(true);
    setTranslateX(window.innerWidth);

    setTimeout(() => {
      onDateChange(addWeeks(currentDate, -1));
    }, 300);
  }, [currentDate, onDateChange, isAnimating]);

  return {
    isAnimating,
    translateX,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    goToNextWeek,
    goToPreviousWeek,
  };
}
