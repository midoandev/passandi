import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useSyncStore } from "@/shared/lib/sync/syncStore";
import {
  getLocalVaultItems,
  createLocalVaultItem,
  updateLocalVaultItem,
  deleteLocalVaultItem,
  toggleLocalFavorite,
} from "../api/vaultApi";
import {
  fetchCategories,
  createLocalCategory,
  updateLocalCategory,
  deleteLocalCategory,
  updateCategorySortOrder,
} from "../api/categoryApi";
import type { VaultItemForm } from "@/entities/vault";

export const VAULT_KEY = (uid: string) => ["vault", uid];
export const CATEGORIES_KEY = (uid: string) => ["categories", uid];

// ─── READ ─────────────────────────────────────────────────────────────

export const useVaultItems = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  return useQuery({
    queryKey: VAULT_KEY(userId),
    queryFn: async () => {
      const result = await getLocalVaultItems(userId, null, 1, 9999, "");
      return result.items;
    },
    enabled: !!userId,
    staleTime: Infinity,
  });
};

export const useCategories = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  return useQuery({
    queryKey: CATEGORIES_KEY(userId),
    queryFn: () => fetchCategories(userId),
    enabled: !!userId,
  });
};

// ─── SHARED HELPER ────────────────────────────────────────────────────

const useVaultMutationBase = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();
  const startSync = useSyncStore((s) => s.startSync);

  const invalidateVault = () =>
    queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) });

  const invalidateCategories = () =>
    queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY(userId) });

  const sync = () => startSync(userId);

  return { userId, queryClient, invalidateVault, invalidateCategories, sync };
};

// ─── VAULT MUTATIONS ──────────────────────────────────────────────────

export const useCreateVaultItem = () => {
  const { userId, invalidateVault, sync } = useVaultMutationBase();

  return useMutation({
    mutationFn: (form: VaultItemForm) =>
      createLocalVaultItem(userId, form),
    onSuccess: () => { invalidateVault(); sync(); },
  });
};

export const useUpdateVaultItem = () => {
  const { userId, invalidateVault, sync } = useVaultMutationBase();

  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: VaultItemForm }) =>
      updateLocalVaultItem(id, form),
    onSuccess: () => { invalidateVault(); sync(); },
  });
};

export const useDeleteVaultItem = () => {
  const { userId, invalidateVault, sync } = useVaultMutationBase();

  return useMutation({
    mutationFn: (id: string) => deleteLocalVaultItem(userId, id),
    onSuccess: () => { invalidateVault(); sync(); },
    onError: (e) => console.error("Delete vault error:", e),
  });
};

export const useToggleFavorite = () => {
  const { userId, queryClient, invalidateVault, sync } = useVaultMutationBase();

  return useMutation({
    mutationFn: ({ id, current }: { id: string; current: boolean }) =>
      toggleLocalFavorite(userId, id, current),
    onMutate: async ({ id, current }) => {
      await queryClient.cancelQueries({ queryKey: VAULT_KEY(userId) });
      const previous = queryClient.getQueryData(VAULT_KEY(userId));
      queryClient.setQueryData(VAULT_KEY(userId), (old: any[]) =>
        old?.map((item) =>
          item.id === id ? { ...item, isFavorite: !current } : item
        )
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      queryClient.setQueryData(VAULT_KEY(userId), ctx?.previous);
    },
    onSuccess: () => { invalidateVault(); sync(); },
  });
};

// ─── CATEGORY MUTATIONS ───────────────────────────────────────────────

export const useCreateCategory = () => {
  const { userId, invalidateCategories, sync } = useVaultMutationBase();

  return useMutation({
    mutationFn: ({ label, icon, color }:
      { label: string; icon: string; color: string }) =>
      createLocalCategory(userId, label, icon, color),
    onSuccess: () => { invalidateCategories(); sync(); },
  });
};

export const useUpdateCategory = () => {
  const { userId, invalidateCategories, sync } = useVaultMutationBase();

  return useMutation({
    mutationFn: ({ id, label, icon }:
      { id: string; label: string; icon: string }) =>
      updateLocalCategory(id, label, icon),
    onSuccess: () => { invalidateCategories(); sync(); },
  });
};

export const useDeleteCategory = () => {
  const { userId, invalidateCategories, sync } = useVaultMutationBase();

  return useMutation({
    mutationFn: (id: string) => deleteLocalCategory(id),
    onSuccess: () => { invalidateCategories(); sync(); },
    onError: (e) => console.error("Delete category error:", e),
  });
};

export const useReorderCategories = () => {
  const { invalidateCategories, sync } = useVaultMutationBase();

  return useMutation({
    mutationFn: (items: { id: string; sortOrder: number }[]) =>
      updateCategorySortOrder(items),
    onSuccess: () => { invalidateCategories(); sync(); },
  });
};