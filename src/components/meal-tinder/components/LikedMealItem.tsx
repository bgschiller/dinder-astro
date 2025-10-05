import React from "react";
import type { Meal } from "../types";

interface LikedMealItemProps {
  meal: Meal;
  index: number;
  isDragging: boolean;
  isDropTarget: boolean;
  dropPosition: "before" | "after" | null;
  isJustDropped: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent, element: HTMLElement) => void;
  onDragEnd: () => void;
  onDragLeave: () => void;
  onRemove: () => void;
}

export const LikedMealItem: React.FC<LikedMealItemProps> = ({
  meal,
  index,
  isDragging,
  isDropTarget,
  dropPosition,
  isJustDropped,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragLeave,
  onRemove,
}) => {
  const className = [
    "liked-meal-item",
    isDragging && "dragging",
    isDropTarget && dropPosition === "before" && "drop-before",
    isDropTarget && dropPosition === "after" && "drop-after",
    isJustDropped && "just-dropped",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      draggable={true}
      onDragStart={onDragStart}
      onDragOver={(e) => onDragOver(e, e.currentTarget as HTMLElement)}
      onDragEnd={onDragEnd}
      onDragLeave={onDragLeave}
    >
      <div className="drag-handle" title="Drag to reorder">
        ⋮⋮
      </div>
      <div className="liked-meal-number">{index + 1}</div>
      <div className="liked-meal-details">
        <div className="liked-meal-name">{meal.data.name}</div>
        {meal.data.url && (
          <a
            href={meal.data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="liked-meal-link"
            onClick={(e) => e.stopPropagation()}
          >
            View Recipe →
          </a>
        )}
      </div>
      <button
        onClick={onRemove}
        className="remove-meal-btn"
        title="Remove meal"
      >
        ✖
      </button>
    </div>
  );
};
