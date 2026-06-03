// Icon Types
export type IconType = "emoji" | "color" | "ionicon";

export type VaultIcon = {
  type: IconType;
  value: string; // emoji char / hex color / ionicon name
  color: string; // background color hex
};

// Custom Field
export type CustomField = {
  id: string;
  label: string;
  value: string;
  isSecret: boolean; // tampil sebagai ●●●● jika true
};

// Vault Item — sesuai database
export type VaultItem = {
  id: string;
  userId: string;
  title: string;
  categoryId: string;
  isFavorite: boolean;

  // Icon
  iconType: IconType;
  iconValue: string;
  iconColor: string;

  // Core Fields — semua opsional kecuali title
  username?: string;
  email?: string;
  password?: string; // sudah terenkripsi
  pin?: string; // sudah terenkripsi
  phone?: string;
  url?: string;
  notes?: string;
  holderName?: string;
  expiredDate?: string; // MM/YYYY

  customFields: CustomField[];

  createdAt: string;
  updatedAt: string;
};

// Form — untuk create/edit (password plain text, belum dienkripsi)
export type VaultItemForm = Omit<
  VaultItem,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

// Category
export type VaultCategory = {
  id: string;
  userId: string;
  label: string;
  icon: string;
  color: string;
  sortOrder: number;
  isDefault: boolean;
};
