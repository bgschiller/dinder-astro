import React from "react";

interface StatusDisplayProps {
  currentIndex: number;
  totalMeals: number;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({
  currentIndex,
  totalMeals,
}) => {
  return (
    <div className="status-text">
      {currentIndex >= 0 ? (
        <p>
          Meal {totalMeals - currentIndex} of {totalMeals}
        </p>
      ) : (
        <p>No more meals! Check your selections below.</p>
      )}
    </div>
  );
};
