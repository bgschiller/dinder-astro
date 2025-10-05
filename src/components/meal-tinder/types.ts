import type { getCollection } from "astro:content";

export type Meal = Awaited<ReturnType<typeof getCollection>>[number];

export interface MealTinderProps {
  meals: Meal[];
}

export interface DragState {
  draggedIndex: number | null;
  dragOverIndex: number | null;
  dropPosition: "before" | "after" | null;
  justDroppedIndex: number | null;
}
