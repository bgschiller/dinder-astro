import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { Meal } from "../types";
import { shuffleArray } from "../utils/shuffleArray";
import { loadDeckOrder, saveDeckOrder } from "../utils/localStorage";

interface UseMealDeckReturn {
  shuffledMeals: Meal[];
  currentIndex: number;
  currentIndexRef: React.MutableRefObject<number>;
  childRefs: React.RefObject<any>[];
  updateCurrentIndex: (val: number) => void;
  initializeNewDeck: () => void;
  showEndCard: boolean;
  canSwipe: boolean;
  canGoBack: boolean;
}

export const useMealDeck = (meals: Meal[]): UseMealDeckReturn => {
  const [shuffledMeals, setShuffledMeals] = useState<Meal[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showEndCard, setShowEndCard] = useState(false);
  const currentIndexRef = useRef(currentIndex);

  // Helper function to initialize a new deck
  const initializeNewDeck = useCallback(() => {
    const shuffled = shuffleArray(meals);
    setShuffledMeals(shuffled);
    const initialIndex = shuffled.length - 1;
    setCurrentIndex(initialIndex);
    currentIndexRef.current = initialIndex;
    setShowEndCard(false);

    // Save to localStorage
    saveDeckOrder(shuffled, initialIndex);
  }, [meals]);

  // Initialize shuffled meals and load state from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loaded = loadDeckOrder(meals);

    if (loaded) {
      setShuffledMeals(loaded.shuffledMeals);
      setCurrentIndex(loaded.currentIndex);
      currentIndexRef.current = loaded.currentIndex;
      setShowEndCard(loaded.currentIndex < 0);
    } else {
      initializeNewDeck();
    }
  }, [initializeNewDeck]);

  // Save current index to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined" || shuffledMeals.length === 0) return;
    saveDeckOrder(shuffledMeals, currentIndex);
  }, [currentIndex, shuffledMeals]);

  // Create refs for each card
  const childRefs = useMemo(
    () =>
      Array(shuffledMeals.length)
        .fill(0)
        .map(() => ({ current: null })),
    [shuffledMeals.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;

    if (val < 0) {
      setShowEndCard(true);
    }
  };

  const canGoBack = currentIndex < shuffledMeals.length - 1;
  const canSwipe = currentIndex >= 0;

  return {
    shuffledMeals,
    currentIndex,
    currentIndexRef,
    childRefs,
    updateCurrentIndex,
    initializeNewDeck,
    showEndCard,
    canSwipe,
    canGoBack,
  };
};
