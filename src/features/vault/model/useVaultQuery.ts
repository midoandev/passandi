import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/model/authStore";
import {
  fetchVaultItems,
  createVaultItem,
  updateVaultItem,
  deleteVaultItem,
  toggleFavorite,
  fetchCategories,
} from "../api/vaultApi";
import type { VaultItemForm } from "@/entities/vault";

const VAULT_KEY = (userId: string) => ["vault", userId];
const CATEGORIES_KEY = (userId: string) => ["categories", userId];

// READ
export const useVaultItems = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  return useQuery({
    queryKey: VAULT_KEY(userId),
    queryFn: () => fetchVaultItems(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 menit
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

  return useMutation({
    mutationFn: (form: VaultItemForm) => createVaultItem(userId, form),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) }),
  });
};

// UPDATE
export const useUpdateVaultItem = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: Partial<VaultItemForm> }) =>
      updateVaultItem(userId, id, form),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) }),
  });
};

// DELETE
export const useDeleteVaultItem = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVaultItem(userId, id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) }),
  });
};

// TOGGLE FAVORITE
export const useToggleFavorite = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, current }: { id: string; current: boolean }) =>
      toggleFavorite(userId, id, current),
    // Optimistic update — langsung update UI tanpa tunggu server
    onMutate: async ({ id, current }) => {
      await queryClient.cancelQueries({ queryKey: VAULT_KEY(userId) });
      const previous = queryClient.getQueryData(VAULT_KEY(userId));

      queryClient.setQueryData(VAULT_KEY(userId), (old: any[]) =>
        old?.map((item) =>
          item.id === id ? { ...item, isFavorite: !current } : item,
        ),
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(VAULT_KEY(userId), context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: VAULT_KEY(userId) });
    },
  });
};
