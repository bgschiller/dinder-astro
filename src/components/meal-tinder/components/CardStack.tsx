import React from "react";
import TinderCard from "react-tinder-card";
import type { Meal } from "../types";
import { MealCard } from "./MealCard";
import { EndCard } from "./EndCard";

interface CardStackProps {
  meals: Meal[];
  currentIndex: number;
  childRefs: React.RefObject<any>[];
  showEndCard: boolean;
  onSwipe: (direction: string, mealName: string, index: number) => void;
  onCardLeftScreen: (mealName: string, index: number) => void;
  onReshuffle: () => void;
}

export const CardStack: React.FC<CardStackProps> = ({
  meals,
  currentIndex,
  childRefs,
  showEndCard,
  onSwipe,
  onCardLeftScreen,
  onReshuffle,
}) => {
  return (
    <div className="tinder-card-stack">
      {showEndCard && <EndCard onReshuffle={onReshuffle} />}

      {meals.map((meal, index) => {
        // Only render cards that haven't been swiped yet
        if (index > currentIndex) return null;

        // Performance optimization: only render current card and next 2
        const showNowOrSoon = index <= currentIndex + 2;
        if (!showNowOrSoon) return null;

        return (
          <TinderCard
            ref={childRefs[index]}
            className="tinder-card"
            key={meal.data.name}
            onSwipe={(dir) => onSwipe(dir, meal.data.name, index)}
            onCardLeftScreen={() => onCardLeftScreen(meal.data.name, index)}
            preventSwipe={["up", "down"]}
          >
            <MealCard meal={meal} />
          </TinderCard>
        );
      })}
    </div>
  );
};
