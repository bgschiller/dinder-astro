import { useState, useRef, useCallback, useEffect } from "react";
import type { Meal } from "../types";

interface UseDragAndDropReturn {
  draggedIndex: number | null;
  dragOverIndex: number | null;
  dropPosition: "before" | "after" | null;
  justDroppedIndex: number | null;
  isReordering: boolean;
  handleDragStart: (index: number) => void;
  handleDragOver: (
    e: React.DragEvent,
    index: number,
    element: HTMLElement
  ) => void;
  handleDragEnd: (meals: Meal[], setMeals: (meals: Meal[]) => void) => void;
  handleDragLeave: () => void;
}

export const useDragAndDrop = (): UseDragAndDropReturn => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<"before" | "after" | null>(
    null
  );
  const [justDroppedIndex, setJustDroppedIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const dropHighlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, index: number, element: HTMLElement) => {
      e.preventDefault();

      // Calculate if we're in the top or bottom half of the element
      const rect = element.getBoundingClientRect();
      const mouseY = e.clientY;
      const elementMiddle = rect.top + rect.height / 2;
      const position = mouseY < elementMiddle ? "before" : "after";

      setDragOverIndex(index);
      setDropPosition(position);
    },
    []
  );

  const handleDragEnd = useCallback(
    (meals: Meal[], setMeals: (meals: Meal[]) => void) => {
      if (
        draggedIndex !== null &&
        dragOverIndex !== null &&
        draggedIndex !== dragOverIndex
      ) {
        // Disable hover effects during reorder
        setIsReordering(true);

        const newMeals = [...meals];
        const draggedItem = newMeals[draggedIndex];

        // Remove the dragged item
        newMeals.splice(draggedIndex, 1);

        // Calculate the correct insertion index
        let insertIndex = dragOverIndex;

        // If dragging from before the target to after it, adjust index
        if (draggedIndex < dragOverIndex) {
          insertIndex = dragOverIndex - 1;
        }

        // Adjust based on drop position
        if (dropPosition === "after") {
          insertIndex += 1;
        }

        newMeals.splice(insertIndex, 0, draggedItem);
        setMeals(newMeals);

        // Highlight the dropped item briefly
        setJustDroppedIndex(insertIndex);

        // Clear any existing timeout
        if (dropHighlightTimeoutRef.current) {
          clearTimeout(dropHighlightTimeoutRef.current);
        }

        // Re-enable hover on next pointer movement
        const handlePointerMove = () => {
          setIsReordering(false);
          document.removeEventListener("pointermove", handlePointerMove);
        };
        document.addEventListener("pointermove", handlePointerMove, {
          once: true,
        });

        dropHighlightTimeoutRef.current = setTimeout(() => {
          setJustDroppedIndex(null);
          dropHighlightTimeoutRef.current = null;
        }, 1500);
      }
      setDraggedIndex(null);
      setDragOverIndex(null);
      setDropPosition(null);
    },
    [draggedIndex, dragOverIndex, dropPosition]
  );

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
    setDropPosition(null);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropHighlightTimeoutRef.current) {
        clearTimeout(dropHighlightTimeoutRef.current);
      }
    };
  }, []);

  return {
    draggedIndex,
    dragOverIndex,
    dropPosition,
    justDroppedIndex,
    isReordering,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
  };
};
