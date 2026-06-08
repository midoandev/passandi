import type { VaultCategory } from "@/entities/vault";

export const SORT_ALL = 0;
export const SORT_FAVORITE = 1;

export const isAllCategory = (c: VaultCategory) => c.sortOrder === SORT_ALL;
export const isFavoriteCategory = (c: VaultCategory) => c.sortOrder === SORT_FAVORITE;
export const isSystemCategory = (c: VaultCategory) =>
  c.sortOrder === SORT_ALL || c.sortOrder === SORT_FAVORITE;

// Untuk filter vault items
export const filterByCategory = (
  items: any[],
  cat: VaultCategory | null,
  categories: VaultCategory[],
): any[] => {
  if (!cat) return items;
  if (isAllCategory(cat)) return items;
  if (isFavoriteCategory(cat)) return items.filter((i) => i.isFavorite === true);
  return items.filter((i) => i.categoryId === cat.id);
};