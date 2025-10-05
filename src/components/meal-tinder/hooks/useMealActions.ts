import { useState, useEffect, useRef, useCallback } from "react";
import type { Meal } from "../types";
import {
  loadLikedMeals,
  saveLikedMeals,
  loadDislikedMeals,
  saveDislikedMeals,
  removeLikedMeals,
  removeDislikedMeals,
} from "../utils/localStorage";

interface UseMealActionsReturn {
  likedMeals: Meal[];
  dislikedMeals: Meal[];
  setLikedMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  setDislikedMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  handleLike: (meal: Meal) => void;
  handleDislike: (meal: Meal) => void;
  handleRemoveLikedMeal: (index: number) => void;
  handleCopyLikedMeals: () => Promise<void>;
  handleClearLikedMeals: () => void;
  handleUndoClear: () => void;
  copySuccess: boolean;
  showUndoClear: boolean;
}

export const useMealActions = (allMeals: Meal[]): UseMealActionsReturn => {
  const [likedMeals, setLikedMeals] = useState<Meal[]>([]);
  const [dislikedMeals, setDislikedMeals] = useState<Meal[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [clearedMeals, setClearedMeals] = useState<Meal[] | null>(null);
  const [showUndoClear, setShowUndoClear] = useState(false);
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load liked and disliked meals from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const liked = loadLikedMeals(allMeals);
    const disliked = loadDislikedMeals(allMeals);

    setLikedMeals(liked);
    setDislikedMeals(disliked);
  }, [allMeals]);

  // Save liked meals to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    saveLikedMeals(likedMeals);
  }, [likedMeals]);

  // Save disliked meals to localStorage whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    saveDislikedMeals(dislikedMeals);
  }, [dislikedMeals]);

  const handleLike = useCallback((meal: Meal) => {
    setLikedMeals((prev) => [...prev, meal]);
  }, []);

  const handleDislike = useCallback((meal: Meal) => {
    setDislikedMeals((prev) => [...prev, meal]);
  }, []);

  const handleRemoveLikedMeal = useCallback((index: number) => {
    setLikedMeals((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleCopyLikedMeals = useCallback(async () => {
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
  }, [likedMeals]);

  const handleClearLikedMeals = useCallback(() => {
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
      removeLikedMeals();
      clearTimeoutRef.current = null;
    }, 3000);
  }, [likedMeals]);

  const handleUndoClear = useCallback(() => {
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
  }, [clearedMeals]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
    };
  }, []);

  return {
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
  };
};
