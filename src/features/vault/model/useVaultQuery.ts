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
  createLocalCategory,
  deleteLocalCategory,
  fetchCategories,
  updateCategorySortOrder,
  updateLocalCategory
} from "../api/categoryApi";
import type { VaultItemForm } from "@/entities/vault";

export const VAULT_KEY = (userId: string) => ["vault", userId];
export const CATEGORIES_KEY = (userId: string) => ["categories", userId];

// READ dari local DB
export const useVaultItems = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");

  return useQuery({
    queryKey: VAULT_KEY(userId),
    queryFn: () => getLocalVaultItems(userId),
    enabled: !!userId,
    staleTime: Infinity,     // local data tidak stale — sync engine yang urus
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

// CREATE
export const useCreateVaultItem = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();
  const startSync = useSyncStore((s) => s.startSync);

  return useMutation({
    mutationFn: (form: VaultItemForm) =>
      createLocalVaultItem(userId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) });
      startSync(userId);   // trigger sync setelah create
    },
  });
};

// UPDATE
export const useUpdateVaultItem = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();
  const startSync = useSyncStore((s) => s.startSync);

  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: Partial<VaultItemForm> }) =>
      updateLocalVaultItem(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) });
      startSync(userId);
    },
  });
};

// DELETE
export const useDeleteVaultItem = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();
  const startSync = useSyncStore((s) => s.startSync);

  return useMutation({
    mutationFn: (id: string) => deleteLocalVaultItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) });
      startSync(userId);
    },
  });
};

// TOGGLE FAVORITE — optimistic
export const useToggleFavorite = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();
  const startSync = useSyncStore((s) => s.startSync);

  return useMutation({
    mutationFn: ({ id, current }: { id: string; current: boolean }) =>
      toggleLocalFavorite(id, current),
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
    onError: (_err, _vars, ctx) => {
      queryClient.setQueryData(VAULT_KEY(userId), ctx?.previous);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) });
      startSync(userId);
    },
  });
};

export const useCreateCategory = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();
  const startSync = useSyncStore((s) => s.startSync);

  return useMutation({
    mutationFn: ({
      label, icon, color,
    }: { label: string; icon: string; color: string }) =>
      createLocalCategory(userId, label, icon, color),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY(userId) });
      startSync(userId);
    },
  });
};

export const useUpdateCategory = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();
  const startSync = useSyncStore((s) => s.startSync);

  return useMutation({
    mutationFn: ({
      id, label, icon,
    }: { id: string; label: string; icon: string }) =>
      updateLocalCategory(id, label, icon),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY(userId) });
      startSync(userId);
    },
  });
};

export const useDeleteCategory = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();
  const startSync = useSyncStore((s) => s.startSync);

  return useMutation({
    mutationFn: (id: string) => deleteLocalCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY(userId) });
      startSync(userId);
    },
  });
};

export const useReorderCategories = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();
  const startSync = useSyncStore((s) => s.startSync);

  return useMutation({
    mutationFn: (items: { id: string; sortOrder: number }[]) =>
      updateCategorySortOrder(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY(userId) });
      startSync(userId);
    },
  });
};