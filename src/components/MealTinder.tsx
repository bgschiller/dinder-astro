import React, { useState, useMemo, useEffect, useRef } from "react";
import TinderCard from "react-tinder-card";
import type { getCollection } from "astro:content";

type Meal = Awaited<ReturnType<typeof getCollection>>[number];
interface MealTinderProps {
  meals: Meal[];
}

// Lazy-loaded image component with priority loading
interface LazyImageProps {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
  onLoad?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  priority = false,
  onLoad,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading when card is 100px away from viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div className="card-image" ref={imgRef}>
      {!isLoaded && (
        <div className="image-placeholder">
          <div className="loading-spinner"></div>
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`meal-image ${isLoaded ? "loaded" : "loading"}`}
          draggable={false}
          onLoad={handleLoad}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
};

// Helper function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const MealTinder: React.FC<MealTinderProps> = ({ meals }) => {
  const [shuffledMeals, setShuffledMeals] = useState<Meal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [lastDirection, setLastDirection] = useState<string>("");
  const [likedMeals, setLikedMeals] = useState<Meal[]>([]);
  const [dislikedMeals, setDislikedMeals] = useState<Meal[]>([]);
  const [showEndCard, setShowEndCard] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [clearedMeals, setClearedMeals] = useState<Meal[] | null>(null);
  const [showUndoClear, setShowUndoClear] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<"before" | "after" | null>(
    null
  );
  const [justDroppedIndex, setJustDroppedIndex] = useState<number | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const currentIndexRef = React.useRef(currentIndex);
  const clearTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const likedMealRefs = React.useRef<React.RefObject<any>[]>([]);
  const dropHighlightTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Update refs array when likedMeals changes
  useEffect(() => {
    likedMealRefs.current = likedMeals.map(
      (_, i) => likedMealRefs.current[i] || React.createRef()
    );
  }, [likedMeals.length]);

  // Helper function to initialize a new deck
  const initializeNewDeck = React.useCallback(() => {
    const shuffled = shuffleArray(meals);
    setShuffledMeals(shuffled);
    const initialIndex = shuffled.length - 1;
    setCurrentIndex(initialIndex);
    currentIndexRef.current = initialIndex;
    setShowEndCard(false);

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "dinder-meal-order",
        JSON.stringify(shuffled.map((m) => m.id))
      );
      localStorage.setItem("dinder-current-index", initialIndex.toString());
    }
  }, [meals]);

  // Initialize shuffled meals and load state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedOrder = localStorage.getItem("dinder-meal-order");
    const storedIndex = localStorage.getItem("dinder-current-index");
    const storedLiked = localStorage.getItem("dinder-liked-meals");
    const storedDisliked = localStorage.getItem("dinder-disliked-meals");

    if (storedOrder) {
      try {
        const orderIds = JSON.parse(storedOrder);
        // Reconstruct the shuffled order from stored IDs
        const reconstructed = orderIds
          .map((id: string) => meals.find((m) => m.id === id))
          .filter(Boolean);

        if (reconstructed.length === meals.length) {
          setShuffledMeals(reconstructed);
          const index = storedIndex
            ? parseInt(storedIndex, 10)
            : reconstructed.length - 1;
          setCurrentIndex(index);
          currentIndexRef.current = index;
          setShowEndCard(index < 0);
        } else {
          // Mismatch in meals, reshuffle
          initializeNewDeck();
        }
      } catch (e) {
        initializeNewDeck();
      }
    } else {
      initializeNewDeck();
    }

    if (storedLiked) {
      try {
        const likedIds = JSON.parse(storedLiked);
        const reconstructedLiked = likedIds
          .map((id: string) => meals.find((m) => m.id === id))
          .filter(Boolean);
        setLikedMeals(reconstructedLiked);
      } catch (e) {
        // Ignore parsing errors
      }
    }

    if (storedDisliked) {
      try {
        const dislikedIds = JSON.parse(storedDisliked);
        const reconstructedDisliked = dislikedIds
          .map((id: string) => meals.find((m) => m.id === id))
          .filter(Boolean);
        setDislikedMeals(reconstructedDisliked);
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, [initializeNewDeck]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined" || shuffledMeals.length === 0) return;

    localStorage.setItem("dinder-current-index", currentIndex.toString());
  }, [currentIndex, shuffledMeals.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      "dinder-liked-meals",
      JSON.stringify(likedMeals.map((m) => m.id))
    );
  }, [likedMeals]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(
      "dinder-disliked-meals",
      JSON.stringify(dislikedMeals.map((m) => m.id))
    );
  }, [dislikedMeals]);

  const childRefs = useMemo(
    () =>
      Array(shuffledMeals.length)
        .fill(0)
        .map(() => React.createRef<any>()),
    [shuffledMeals.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;

    if (val < 0) {
      setShowEndCard(true);
    }

    // Preload images for the next few cards when current index changes
    if (val >= 0) {
      const nextCards = shuffledMeals.slice(Math.max(0, val - 1), val + 3);
      nextCards.forEach((meal) => {
        if (meal?.data?.image) {
          const img = new Image();
          img.src = meal.data.image;
        }
      });
    }
  };

  const canGoBack = currentIndex < shuffledMeals.length - 1;

  const canSwipe = currentIndex >= 0;

  const swiped = (direction: string, nameToDelete: string, index: number) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);

    const meal = shuffledMeals.find((m) => m.data.name === nameToDelete);
    if (meal) {
      if (direction === "right") {
        setLikedMeals((prev) => [...prev, meal]);
      } else if (direction === "left") {
        setDislikedMeals((prev) => [...prev, meal]);
      }
    }
  };

  const outOfFrame = (_name: string, idx: number) => {
    if (currentIndexRef.current >= idx) {
      childRefs[idx].current.restoreCard();
    }
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < shuffledMeals.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    setShowEndCard(false);
    await childRefs[newIndex].current.restoreCard();
  };

  const handleReshuffle = () => {
    // Clear disliked meals but keep liked meals
    setDislikedMeals([]);
    localStorage.removeItem("dinder-disliked-meals");

    // Reshuffle and reset
    initializeNewDeck();
  };

  const handleCopyLikedMeals = async () => {
    if (likedMeals.length === 0) return;

    const mealText = likedMeals
      .map((meal, idx) => {
        const urlPart = meal.data.url ? `\n${meal.data.url}` : "";
        return `${idx + 1}. ${meal.data.name}${urlPart}`;
      })
      .join("\n\n");

    try {
      await navigator.clipboard.writeText(mealText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleClearLikedMeals = () => {
    // Clear any existing timeout
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
    }

    // Store the current liked meals for undo
    setClearedMeals(likedMeals);
    setLikedMeals([]);
    setShowUndoClear(true);

    // Set timeout to permanently clear after 3 seconds
    clearTimeoutRef.current = setTimeout(() => {
      setClearedMeals(null);
      setShowUndoClear(false);
      localStorage.removeItem("dinder-liked-meals");
      clearTimeoutRef.current = null;
    }, 3000);
  };

  const handleUndoClear = () => {
    // Clear the timeout
    if (clearTimeoutRef.current) {
      clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = null;
    }

    // Restore the cleared meals
    if (clearedMeals) {
      setLikedMeals(clearedMeals);
      setClearedMeals(null);
      setShowUndoClear(false);
    }
  };

  const handleRemoveLikedMeal = (index: number) => {
    setLikedMeals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (
    e: React.DragEvent,
    index: number,
    element: HTMLElement
  ) => {
    e.preventDefault();

    // Calculate if we're in the top or bottom half of the element
    const rect = element.getBoundingClientRect();
    const mouseY = e.clientY;
    const elementMiddle = rect.top + rect.height / 2;
    const position = mouseY < elementMiddle ? "before" : "after";

    setDragOverIndex(index);
    setDropPosition(position);
  };

  const handleDragEnd = () => {
    if (
      draggedIndex !== null &&
      dragOverIndex !== null &&
      draggedIndex !== dragOverIndex
    ) {
      // Disable hover effects during reorder
      setIsReordering(true);

      const newLikedMeals = [...likedMeals];
      const draggedItem = newLikedMeals[draggedIndex];

      // Remove the dragged item
      newLikedMeals.splice(draggedIndex, 1);

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

      newLikedMeals.splice(insertIndex, 0, draggedItem);
      setLikedMeals(newLikedMeals);

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
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
    setDropPosition(null);
  };

  // Handle keyboard events
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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
      if (dropHighlightTimeoutRef.current) {
        clearTimeout(dropHighlightTimeoutRef.current);
      }
    };
  }, []);

  // Don't render until we have shuffled meals
  if (shuffledMeals.length === 0) {
    return <div className="tinder-container">Loading...</div>;
  }

  return (
    <div className="tinder-container">
      <div className="tinder-card-stack">
        {/* End of deck card */}
        {showEndCard && (
          <div className="tinder-card end-card">
            <div className="end-card-content">
              <h2>🎉 You've seen all the meals!</h2>
              <p>Click the button below to reshuffle and start over.</p>
              <button onClick={handleReshuffle} className="reshuffle-btn">
                🔀 Reshuffle Deck
              </button>
            </div>
          </div>
        )}

        {shuffledMeals.map((meal, index) => {
          // Only render cards that haven't been swiped yet
          if (index > currentIndex) return null;

          // Determine if this card should have priority loading
          // Priority for: current card, next 2 cards, and previous 1 card (if any)
          const isPriority =
            index >= currentIndex - 1 && index <= currentIndex + 2;

          return (
            <TinderCard
              ref={childRefs[index]}
              className="tinder-card"
              key={meal.data.name}
              onSwipe={(dir) => swiped(dir, meal.data.name, index)}
              onCardLeftScreen={() => outOfFrame(meal.data.name, index)}
              preventSwipe={["up", "down"]}
            >
              <div className="tinder-card">
                {/* Lazy-loaded Image */}
                <LazyImage
                  src={meal.data.image}
                  alt={meal.data.name}
                  className="meal-image"
                  priority={isPriority}
                />

                {/* Content */}
                <div className="card-content">
                  <h2 className="card-title">{meal.data.name}</h2>

                  {meal.data.url && (
                    <button
                      className="recipe-link"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(
                          meal.data.url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }}
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
            </TinderCard>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="action-buttons">
        <button
          onClick={() => swipe("left")}
          className="action-btn btn-dislike"
          disabled={!canSwipe}
        >
          ❌
        </button>
        <button
          onClick={goBack}
          className={`action-btn btn-back ${!canGoBack ? "disabled" : ""}`}
          disabled={!canGoBack}
        >
          ↩
        </button>
        <button
          onClick={() => swipe("right")}
          className="action-btn btn-like"
          disabled={!canSwipe}
        >
          🤍️
        </button>
      </div>

      {/* Status */}
      <div className="status-text">
        {currentIndex >= 0 ? (
          <p>
            Meal {shuffledMeals.length - currentIndex} of {shuffledMeals.length}
          </p>
        ) : (
          <p>No more meals! Check your selections below.</p>
        )}
      </div>

      {/* Liked meals list */}
      {likedMeals.length > 0 && (
        <div className="liked-meals-box">
          <div className="liked-meals-header">
            <h3>❤️ Your Meal Plan ({likedMeals.length})</h3>
            <div className="liked-meals-actions">
              <button
                onClick={handleCopyLikedMeals}
                className="copy-btn"
                title="Copy to clipboard"
              >
                {copySuccess ? "✓ Copied!" : "📋 Copy"}
              </button>
              <button
                onClick={handleClearLikedMeals}
                className="clear-btn"
                title="Clear meal plan"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
          <div
            className={`liked-meals-list ${isReordering ? "reordering" : ""}`}
          >
            {likedMeals.map((meal, idx) => (
              <div
                key={meal.id}
                className={`liked-meal-item ${
                  draggedIndex === idx ? "dragging" : ""
                } ${
                  dragOverIndex === idx && dropPosition === "before"
                    ? "drop-before"
                    : ""
                } ${
                  dragOverIndex === idx && dropPosition === "after"
                    ? "drop-after"
                    : ""
                } ${justDroppedIndex === idx ? "just-dropped" : ""}`}
                draggable={true}
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) =>
                  handleDragOver(e, idx, e.currentTarget as HTMLElement)
                }
                onDragEnd={handleDragEnd}
                onDragLeave={handleDragLeave}
              >
                <div className="drag-handle" title="Drag to reorder">
                  ⋮⋮
                </div>
                <div className="liked-meal-number">{idx + 1}</div>
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
                  onClick={() => handleRemoveLikedMeal(idx)}
                  className="remove-meal-btn"
                  title="Remove meal"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Undo clear notification */}
      {showUndoClear && (
        <div className="undo-clear-notification">
          <span>Meal plan cleared</span>
          <button onClick={handleUndoClear} className="undo-btn">
            ↶ Undo
          </button>
        </div>
      )}
    </div>
  );
};

export default MealTinder;
