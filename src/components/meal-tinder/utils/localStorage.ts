import type { Meal } from "../types";

const STORAGE_KEYS = {
  MEAL_ORDER: "dinder-meal-order",
  CURRENT_INDEX: "dinder-current-index",
  LIKED_MEALS: "dinder-liked-meals",
  DISLIKED_MEALS: "dinder-disliked-meals",
} as const;

/**
 * Load the saved deck order from localStorage
 */
export const loadDeckOrder = (
  allMeals: Meal[]
): { shuffledMeals: Meal[]; currentIndex: number } | null => {
  if (typeof window === "undefined") return null;

  const storedOrder = localStorage.getItem(STORAGE_KEYS.MEAL_ORDER);
  const storedIndex = localStorage.getItem(STORAGE_KEYS.CURRENT_INDEX);

  if (!storedOrder) return null;

  try {
    const orderIds = JSON.parse(storedOrder);
    const reconstructed = orderIds
      .map((id: string) => allMeals.find((m) => m.id === id))
      .filter(Boolean);

    if (reconstructed.length === allMeals.length) {
      const index = storedIndex
        ? parseInt(storedIndex, 10)
        : reconstructed.length - 1;
      return { shuffledMeals: reconstructed, currentIndex: index };
    }
  } catch (e) {
    console.error("Failed to load deck order:", e);
  }

  return null;
};

/**
 * Save the deck order to localStorage
 */
export const saveDeckOrder = (meals: Meal[], currentIndex: number): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEYS.MEAL_ORDER,
    JSON.stringify(meals.map((m) => m.id))
  );
  localStorage.setItem(STORAGE_KEYS.CURRENT_INDEX, currentIndex.toString());
};

/**
 * Load liked meals from localStorage
 */
export const loadLikedMeals = (allMeals: Meal[]): Meal[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEYS.LIKED_MEALS);
  if (!stored) return [];

  try {
    const likedIds = JSON.parse(stored);
    return likedIds
      .map((id: string) => allMeals.find((m) => m.id === id))
      .filter(Boolean);
  } catch (e) {
    console.error("Failed to load liked meals:", e);
    return [];
  }
};

/**
 * Save liked meals to localStorage
 */
export const saveLikedMeals = (meals: Meal[]): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEYS.LIKED_MEALS,
    JSON.stringify(meals.map((m) => m.id))
  );
};

/**
 * Load disliked meals from localStorage
 */
export const loadDislikedMeals = (allMeals: Meal[]): Meal[] => {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(STORAGE_KEYS.DISLIKED_MEALS);
  if (!stored) return [];

  try {
    const dislikedIds = JSON.parse(stored);
    return dislikedIds
      .map((id: string) => allMeals.find((m) => m.id === id))
      .filter(Boolean);
  } catch (e) {
    console.error("Failed to load disliked meals:", e);
    return [];
  }
};

/**
 * Save disliked meals to localStorage
 */
export const saveDislikedMeals = (meals: Meal[]): void => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEYS.DISLIKED_MEALS,
    JSON.stringify(meals.map((m) => m.id))
  );
};

/**
 * Remove liked meals from localStorage
 */
export const removeLikedMeals = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.LIKED_MEALS);
};

/**
 * Remove disliked meals from localStorage
 */
export const removeDislikedMeals = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.DISLIKED_MEALS);
};
