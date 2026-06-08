import type { VaultCategory } from "@/entities/vault";
import { create } from "zustand/react";

type VaultUIState = {
  selectedCategory: VaultCategory | null;
  searchQuery: string;
  isSearchVisible: boolean;
  setCategory: (cat: VaultCategory) => void;
  setSearchQuery: (q: string) => void;
  toggleSearch: () => void;
};

export const useVaultUIStore = create<VaultUIState>((set) => ({
  selectedCategory: null,  // null = belum ada data, set saat categories loaded
  searchQuery: "",
  isSearchVisible: false,

  setCategory: (cat) => set({ selectedCategory: cat }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleSearch: () => set((s) => ({ isSearchVisible: !s.isSearchVisible })),
}));