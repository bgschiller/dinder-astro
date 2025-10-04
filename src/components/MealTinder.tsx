import React, { useState, useMemo, useEffect } from "react";
import TinderCard from "react-tinder-card";
import type { getCollection } from "astro:content";

type Meal = Awaited<ReturnType<typeof getCollection>>[number];
interface MealTinderProps {
  meals: Meal[];
}

const MealTinder: React.FC<MealTinderProps> = ({ meals }) => {
  const [currentIndex, setCurrentIndex] = useState(meals.length - 1);
  const [lastDirection, setLastDirection] = useState<string>("");
  const [likedMeals, setLikedMeals] = useState<Meal[]>([]);
  const [dislikedMeals, setDislikedMeals] = useState<Meal[]>([]);

  const currentIndexRef = React.useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(meals.length)
        .fill(0)
        .map(() => React.createRef<any>()),
    [meals.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < meals.length - 1;

  const canSwipe = currentIndex >= 0;

  const swiped = (direction: string, nameToDelete: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);

    const meal = meals.find((m) => m.data.name === nameToDelete);
    if (meal) {
      if (direction === "right") {
        setLikedMeals((prev) => [...prev, meal]);
      } else if (direction === "left") {
        setDislikedMeals((prev) => [...prev, meal]);
      }
    }
  };

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    if (currentIndexRef.current >= idx) {
      childRefs[idx].current.restoreCard();
    }
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < meals.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when not typing in an input field
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          swipe("left");
          break;
        case "ArrowRight":
          event.preventDefault();
          swipe("right");
          break;
        case "ArrowUp":
          event.preventDefault();
          goBack();
          break;
        default:
          break;
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, canSwipe, canGoBack]); // Dependencies to ensure the latest state is used

  return (
    <div className="tinder-container">
      <div className="tinder-card-stack">
        {meals.map((meal, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="tinder-card"
            key={meal.data.name}
            onSwipe={(dir) => swiped(dir, meal.data.name, index)}
            onCardLeftScreen={() => outOfFrame(meal.data.name, index)}
            preventSwipe={["up", "down"]}
          >
            <div className="tinder-card">
              {/* Image */}
              <div className="card-image">
                <img
                  src={meal.data.image}
                  alt={meal.data.name}
                  className="meal-image"
                />
              </div>

              {/* Content */}
              <div className="card-content">
                <h2 className="card-title">{meal.data.name}</h2>

                {meal.data.url && (
                  <a
                    href={meal.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="recipe-link"
                  >
                    View Recipe →
                  </a>
                )}
              </div>
            </div>
          </TinderCard>
        ))}
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        <button
          onClick={() => swipe("left")}
          className="action-btn btn-dislike"
        >
          ❌
        </button>
        <button
          onClick={goBack}
          className={`action-btn btn-back ${!canGoBack ? "disabled" : ""}`}
          disabled={!canGoBack}
        >
          ↶
        </button>
        <button onClick={() => swipe("right")} className="action-btn btn-like">
          ❤️
        </button>
      </div>

      {/* Status */}
      <div className="status-text">
        {currentIndex >= 0 ? (
          <p>
            Meal {meals.length - currentIndex} of {meals.length}
          </p>
        ) : (
          <p>No more meals! Check your selections below.</p>
        )}
      </div>

      {/* Results */}
      {(likedMeals.length > 0 || dislikedMeals.length > 0) && (
        <div className="results-section">
          {likedMeals.length > 0 && (
            <div className="results-liked">
              <h3>❤️ Liked Meals ({likedMeals.length})</h3>
              <div className="results-list">
                {likedMeals.map((meal, idx) => (
                  <div key={idx} className="result-item result-item-liked">
                    <div className="result-title result-title-liked">
                      {meal.data.name}
                    </div>
                    {meal.data.url && (
                      <a
                        href={meal.data.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="result-link"
                      >
                        View Recipe →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {dislikedMeals.length > 0 && (
            <div className="results-disliked">
              <h3>❌ Disliked Meals ({dislikedMeals.length})</h3>
              <div className="results-list">
                {dislikedMeals.map((meal, idx) => (
                  <div key={idx} className="result-item result-item-disliked">
                    <div className="result-title result-title-disliked">
                      {meal.data.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealTinder;
