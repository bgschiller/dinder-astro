import React from "react";
import type { MealTinderProps } from "./meal-tinder/types";
import { useMealDeck } from "./meal-tinder/hooks/useMealDeck";
import { useMealActions } from "./meal-tinder/hooks/useMealActions";
import { useDragAndDrop } from "./meal-tinder/hooks/useDragAndDrop";
import { useKeyboardControls } from "./meal-tinder/hooks/useKeyboardControls";
import { CardStack } from "./meal-tinder/components/CardStack";
import { ActionButtons } from "./meal-tinder/components/ActionButtons";
import { StatusDisplay } from "./meal-tinder/components/StatusDisplay";
import { LikedMealsList } from "./meal-tinder/components/LikedMealsList";
import { UndoNotification } from "./meal-tinder/components/UndoNotification";
import { removeDislikedMeals } from "./meal-tinder/utils/localStorage";

const MealTinder: React.FC<MealTinderProps> = ({ meals }) => {
  // Initialize all hooks
  const {
    shuffledMeals,
    currentIndex,
    currentIndexRef,
    childRefs,
    updateCurrentIndex,
    initializeNewDeck,
    showEndCard,
    canSwipe,
    canGoBack,
  } = useMealDeck(meals);

  const {
    likedMeals,
    dislikedMeals,
    setLikedMeals,
    setDislikedMeals,
    handleLike,
    handleDislike,
    handleRemoveLikedMeal,
    handleCopyLikedMeals,
    handleClearLikedMeals,
    handleUndoClear,
    copySuccess,
    showUndoClear,
  } = useMealActions(meals);

  const {
    draggedIndex,
    dragOverIndex,
    dropPosition,
    justDroppedIndex,
    isReordering,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
  } = useDragAndDrop();

  // Card swiping logic
  const swiped = (direction: string, nameToDelete: string, index: number) => {
    updateCurrentIndex(index - 1);

    const meal = shuffledMeals.find((m) => m.data.name === nameToDelete);
    if (meal) {
      if (direction === "right") {
        handleLike(meal);
      } else if (direction === "left") {
        handleDislike(meal);
      }
    }
  };

  const outOfFrame = (_name: string, idx: number) => {
    if (currentIndexRef.current >= idx) {
      childRefs[idx].current?.restoreCard();
    }
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < shuffledMeals.length) {
      await childRefs[currentIndex].current?.swipe(dir);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current?.restoreCard();
  };

  const handleReshuffle = () => {
    // Clear disliked meals but keep liked meals
    setDislikedMeals([]);
    removeDislikedMeals();

    // Reshuffle and reset
    initializeNewDeck();
  };

  // Keyboard controls
  useKeyboardControls({
    onLeft: () => swipe("left"),
    onRight: () => swipe("right"),
    onUp: goBack,
    canSwipe,
    canGoBack,
    currentIndex,
  });

  // Don't render until we have shuffled meals
  if (shuffledMeals.length === 0) {
    return <div className="tinder-container">Loading...</div>;
  }

  return (
    <div className="tinder-container">
      <CardStack
        meals={shuffledMeals}
        currentIndex={currentIndex}
        childRefs={childRefs}
        showEndCard={showEndCard}
        onSwipe={swiped}
        onCardLeftScreen={outOfFrame}
        onReshuffle={handleReshuffle}
      />

      <ActionButtons
        canSwipe={canSwipe}
        canGoBack={canGoBack}
        onDislike={() => swipe("left")}
        onUndo={goBack}
        onLike={() => swipe("right")}
      />

      <StatusDisplay
        currentIndex={currentIndex}
        totalMeals={shuffledMeals.length}
      />

      <LikedMealsList
        meals={likedMeals}
        isReordering={isReordering}
        onCopy={handleCopyLikedMeals}
        onClear={handleClearLikedMeals}
        onRemove={handleRemoveLikedMeal}
        copySuccess={copySuccess}
        draggedIndex={draggedIndex}
        dragOverIndex={dragOverIndex}
        dropPosition={dropPosition}
        justDroppedIndex={justDroppedIndex}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={() => handleDragEnd(likedMeals, setLikedMeals)}
        onDragLeave={handleDragLeave}
      />

      <UndoNotification show={showUndoClear} onUndo={handleUndoClear} />
    </div>
  );
};

export default MealTinder;
