import React from "react";
import type { Meal } from "../types";
import { LikedMealItem } from "./LikedMealItem";

interface LikedMealsListProps {
  meals: Meal[];
  isReordering: boolean;
  onCopy: () => void;
  onClear: () => void;
  onRemove: (index: number) => void;
  copySuccess: boolean;
  draggedIndex: number | null;
  dragOverIndex: number | null;
  dropPosition: "before" | "after" | null;
  justDroppedIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number, element: HTMLElement) => void;
  onDragEnd: () => void;
  onDragLeave: () => void;
}

export const LikedMealsList: React.FC<LikedMealsListProps> = ({
  meals,
  isReordering,
  onCopy,
  onClear,
  onRemove,
  copySuccess,
  draggedIndex,
  dragOverIndex,
  dropPosition,
  justDroppedIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragLeave,
}) => {
  if (meals.length === 0) return null;

  return (
    <div className="liked-meals-box">
      <div className="liked-meals-header">
        <h3>❤️ Your Meal Plan ({meals.length})</h3>
        <div className="liked-meals-actions">
          <button
            onClick={onCopy}
            className="copy-btn"
            title="Copy to clipboard"
          >
            {copySuccess ? "✓ Copied!" : "📋 Copy"}
          </button>
          <button
            onClick={onClear}
            className="clear-btn"
            title="Clear meal plan"
          >
            🗑️ Clear
          </button>
        </div>
      </div>
      <div className={`liked-meals-list ${isReordering ? "reordering" : ""}`}>
        {meals.map((meal, idx) => (
          <LikedMealItem
            key={meal.id}
            meal={meal}
            index={idx}
            isDragging={draggedIndex === idx}
            isDropTarget={dragOverIndex === idx}
            dropPosition={dragOverIndex === idx ? dropPosition : null}
            isJustDropped={justDroppedIndex === idx}
            onDragStart={() => onDragStart(idx)}
            onDragOver={(e, element) => onDragOver(e, idx, element)}
            onDragEnd={onDragEnd}
            onDragLeave={onDragLeave}
            onRemove={() => onRemove(idx)}
          />
        ))}
      </div>
    </div>
  );
};
