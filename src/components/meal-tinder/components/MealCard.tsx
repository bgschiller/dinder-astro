import React from "react";
import type { Meal } from "../types";

interface MealCardProps {
  meal: Meal;
}

export const MealCard: React.FC<MealCardProps> = ({ meal }) => {
  const handleRecipeClick = (
    e: React.MouseEvent | React.TouchEvent,
    url: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="tinder-card">
      <div className="card-image">
        <img
          src={meal.data.image}
          alt={meal.data.name}
          className="meal-image"
          draggable={false}
          loading="lazy"
        />
      </div>

      <div className="card-content">
        <h2 className="card-title">{meal.data.name}</h2>

        {meal.data.url && (
          <button
            className="recipe-link"
            onClick={(e) => handleRecipeClick(e, meal.data.url!)}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
          >
            View Recipe →
          </button>
        )}
      </div>
    </div>
  );
};
