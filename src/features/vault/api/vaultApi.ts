import { supabase } from "@/shared/lib/supabase";
import { encrypt, decrypt } from "@/shared/lib/encryption";
import type { VaultItem, VaultItemForm, VaultCategory } from "@/entities/vault";

// Helper: snake_case → camelCase
const toCamel = (item: any): VaultItem => ({
  id: item.id,
  userId: item.user_id,
  title: item.title,
  categoryId: item.category_id,
  isFavorite: item.is_favorite,
  iconType: item.icon_type,
  iconValue: item.icon_value,
  iconColor: item.icon_color,
  username: item.username,
  email: item.email,
  password: item.password,
  pin: item.pin,
  phone: item.phone,
  url: item.url,
  notes: item.notes,
  holderName: item.holder_name,
  expiredDate: item.expired_date,
  customFields: item.custom_fields ?? [],
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

// Helper: camelCase → snake_case
const toSnake = (form: Partial<VaultItemForm>, userId: string) => ({
  user_id: userId,
  title: form.title,
  category_id: form.categoryId,
  is_favorite: form.isFavorite,
  icon_type: form.iconType,
  icon_value: form.iconValue,
  icon_color: form.iconColor,
  username: form.username ?? null,
  email: form.email ?? null,
  password: form.password ? encrypt(form.password, userId) : null,
  pin: form.pin ? encrypt(form.pin, userId) : null,
  phone: form.phone ?? null,
  url: form.url ?? null,
  notes: form.notes ?? null,
  holder_name: form.holderName ?? null,
  expired_date: form.expiredDate ?? null,
  custom_fields: form.customFields ?? [],
});

// READ — ambil semua vault items
export const fetchVaultItems = async (userId: string): Promise<VaultItem[]> => {
  const { data, error } = await supabase
    .from("vault_items")
    .select("*")
    .eq("user_id", userId)
    .order("is_favorite", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((item) => {
    const camel = toCamel(item);
    // Decrypt sensitive fields setelah fetch
    if (camel.password) camel.password = decrypt(camel.password, userId);
    if (camel.pin) camel.pin = decrypt(camel.pin, userId);
    return camel;
  });
};

// CREATE
export const createVaultItem = async (
  userId: string,
  form: VaultItemForm,
): Promise<VaultItem> => {
  if (!userId) throw new Error("User tidak terautentikasi");

  const payload = toSnake(form, userId);
  console.log("=== CREATE PAYLOAD ===", JSON.stringify(payload, null, 2));

  const { data, error } = await supabase
    .from("vault_items")
    .insert(payload)
    .select()
    .single();

  console.log("=== SUPABASE RESPONSE ===", { data, error });

  if (error) throw error;

  const camel = toCamel(data);
  if (camel.password) camel.password = decrypt(camel.password, userId);
  if (camel.pin) camel.pin = decrypt(camel.pin, userId);
  return camel;
};

// UPDATE
export const updateVaultItem = async (
  userId: string,
  id: string,
  form: Partial<VaultItemForm>,
): Promise<VaultItem> => {
  const { data, error } = await supabase
    .from("vault_items")
    .update(toSnake(form, userId))
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;

  const camel = toCamel(data);
  if (camel.password) camel.password = decrypt(camel.password, userId);
  if (camel.pin) camel.pin = decrypt(camel.pin, userId);
  return camel;
};

// DELETE
export const deleteVaultItem = async (
  userId: string,
  id: string,
): Promise<void> => {
  const { error } = await supabase
    .from("vault_items")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
};

// TOGGLE FAVORITE
export const toggleFavorite = async (
  userId: string,
  id: string,
  current: boolean,
): Promise<void> => {
  const { error } = await supabase
    .from("vault_items")
    .update({ is_favorite: !current })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
};

// CATEGORIES
export const fetchCategories = async (
  userId: string,
): Promise<VaultCategory[]> => {
  const { data, error } = await supabase
    .from("vault_categories")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order");

  if (error) throw error;

  return (data ?? []).map((c) => ({
    id: c.id,
    userId: c.user_id,
    label: c.label,
    icon: c.icon,
    color: c.color,
    sortOrder: c.sort_order,
    isDefault: c.is_default,
  }));
};
