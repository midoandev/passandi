import { create } from "zustand";
import type { VaultItem, VaultCategory } from "@/entities/vault";

// Store hanya untuk UI state — data dari TanStack Query
type VaultUIState = {
  selectedCategoryId: string;
  searchQuery: string;
  isSearchVisible: boolean;

  setCategory: (id: string) => void;
  setSearchQuery: (q: string) => void;
  toggleSearch: () => void;
};

export const useVaultUIStore = create<VaultUIState>((set) => ({
  selectedCategoryId: "all",
  searchQuery: "",
  isSearchVisible: false,

  setCategory: (id) => set({ selectedCategoryId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleSearch: () => set((s) => ({ isSearchVisible: !s.isSearchVisible })),
}));
