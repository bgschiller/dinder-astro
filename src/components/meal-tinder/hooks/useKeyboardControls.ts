import { useEffect } from "react";

interface UseKeyboardControlsProps {
  onLeft: () => void;
  onRight: () => void;
  onUp: () => void;
  canSwipe: boolean;
  canGoBack: boolean;
  currentIndex: number;
}

export const useKeyboardControls = ({
  onLeft,
  onRight,
  onUp,
  canSwipe,
  canGoBack,
  currentIndex,
}: UseKeyboardControlsProps): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when not typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (canSwipe) onLeft();
          break;
        case "ArrowRight":
          event.preventDefault();
          if (canSwipe) onRight();
          break;
        case "ArrowUp":
          event.preventDefault();
          if (canGoBack) onUp();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, canSwipe, canGoBack, onLeft, onRight, onUp]);
};
