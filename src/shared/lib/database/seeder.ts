import { createLocalVaultItem } from "@/features/vault/api/vaultApi";
import { getLocalCategories } from "@/features/vault/api/categoryApi";
import type { VaultItemForm } from "@/entities/vault";
import { getDb } from "@/shared/lib/database/db";
import { supabase } from "@/shared/lib/supabase";

// Seed data pakai label kategori — nanti kita resolve ke ID
type SeedItem = Omit<VaultItemForm, "categoryId"> & { categoryLabel: string };

const SEED_DATA: SeedItem[] = [
  {
    title: "BCA Mobile", categoryLabel: "Bank",
    iconType: "emoji", iconValue: "🏦", iconColor: "#10B981",
    username: "082112345678", email: "agus@gmail.com",
    password: "BcaP@ss2024!", pin: "123456",
    phone: "082112345678", url: "https://mybca.bca.co.id",
    notes: "Rekening utama", isFavorite: true, customFields: [],
  },
  {
    title: "Mandiri Online", categoryLabel: "Bank",
    iconType: "emoji", iconValue: "🏦", iconColor: "#2563EB",
    username: "agus.mido", email: "agus@gmail.com",
    password: "M@ndiri#2024", pin: "654321",
    url: "https://ibank.bankmandiri.co.id",
    isFavorite: true, customFields: [],
  },
  {
    title: "BNI Mobile", categoryLabel: "Bank",
    iconType: "emoji", iconValue: "🏦", iconColor: "#F59E0B",
    username: "agusmido99", password: "Bni$ecure99",
    pin: "112233", phone: "082198765432",
    isFavorite: false, customFields: [],
  },
  {
    title: "GoPay", categoryLabel: "E-Wallet",
    iconType: "emoji", iconValue: "💳", iconColor: "#10B981",
    username: "082112345678", password: "GoP@y2024",
    phone: "082112345678", url: "https://www.gojek.com",
    isFavorite: true, customFields: [],
  },
  {
    title: "OVO", categoryLabel: "E-Wallet",
    iconType: "emoji", iconValue: "💳", iconColor: "#8B5CF6",
    username: "082112345678", password: "0v0Secure!",
    phone: "082112345678", isFavorite: false, customFields: [],
  },
  {
    title: "Dana", categoryLabel: "E-Wallet",
    iconType: "emoji", iconValue: "💳", iconColor: "#2563EB",
    username: "agus@gmail.com", password: "D@na2024",
    phone: "082112345678", url: "https://dana.id",
    isFavorite: false, customFields: [],
  },
  {
    title: "ShopeePay", categoryLabel: "E-Wallet",
    iconType: "emoji", iconValue: "💳", iconColor: "#EF4444",
    username: "agus_mido", password: "Sh0pee#Pay",
    isFavorite: false, customFields: [],
  },
  {
    title: "Instagram", categoryLabel: "Sosmed",
    iconType: "emoji", iconValue: "📸", iconColor: "#EC4899",
    username: "@agus.mido", email: "agus@gmail.com",
    password: "Inst@gram2024!", url: "https://instagram.com",
    isFavorite: true, customFields: [],
  },
  {
    title: "Twitter / X", categoryLabel: "Sosmed",
    iconType: "emoji", iconValue: "💬", iconColor: "#06B6D4",
    username: "@agusmido", email: "agus@gmail.com",
    password: "Tw1tter$2024", url: "https://x.com",
    isFavorite: false, customFields: [],
  },
  {
    title: "Facebook", categoryLabel: "Sosmed",
    iconType: "emoji", iconValue: "💬", iconColor: "#2563EB",
    email: "agus@gmail.com", password: "Fac3b00k!",
    url: "https://facebook.com", isFavorite: false, customFields: [],
  },
  {
    title: "LinkedIn", categoryLabel: "Sosmed",
    iconType: "emoji", iconValue: "💼", iconColor: "#2563EB",
    email: "agus@gmail.com", password: "L1nk3d1n#",
    url: "https://linkedin.com", isFavorite: false, customFields: [],
  },
  {
    title: "TikTok", categoryLabel: "Sosmed",
    iconType: "emoji", iconValue: "🎵", iconColor: "#6B7280",
    username: "@agusmido", password: "T1kt0k@2024",
    url: "https://tiktok.com", isFavorite: false, customFields: [],
  },
  {
    title: "Gmail Utama", categoryLabel: "Work",
    iconType: "emoji", iconValue: "📧", iconColor: "#EF4444",
    email: "agus@gmail.com", password: "Gm@il$ecure!",
    url: "https://mail.google.com", isFavorite: true,
    customFields: [
      { id: "cf1", label: "Recovery Email", value: "backup@gmail.com", isSecret: false },
      { id: "cf2", label: "2FA Backup Code", value: "XXXX-XXXX-XXXX", isSecret: true },
    ],
  },
  {
    title: "Gmail Kerja", categoryLabel: "Work",
    iconType: "emoji", iconValue: "📧", iconColor: "#F59E0B",
    email: "agus@company.com", password: "W0rkGm@il#",
    url: "https://mail.google.com", isFavorite: false, customFields: [],
  },
  {
    title: "Tokopedia", categoryLabel: "Shopping",
    iconType: "emoji", iconValue: "🛍️", iconColor: "#10B981",
    username: "agusmido", email: "agus@gmail.com",
    password: "T0k0p3dia!", url: "https://tokopedia.com",
    isFavorite: false, customFields: [],
  },
  {
    title: "Shopee", categoryLabel: "Shopping",
    iconType: "emoji", iconValue: "🛍️", iconColor: "#EF4444",
    username: "agus_mido99", email: "agus@gmail.com",
    password: "Sh0pee2024$", url: "https://shopee.co.id",
    isFavorite: false, customFields: [],
  },
  {
    title: "Lazada", categoryLabel: "Shopping",
    iconType: "emoji", iconValue: "🛍️", iconColor: "#2563EB",
    email: "agus@gmail.com", password: "L@z@da#99",
    url: "https://lazada.co.id", isFavorite: false, customFields: [],
  },
  {
    title: "Netflix", categoryLabel: "Hiburan",
    iconType: "emoji", iconValue: "🎬", iconColor: "#EF4444",
    email: "agus@gmail.com", password: "N3tfl1x$2024",
    url: "https://netflix.com", isFavorite: true,
    customFields: [
      { id: "cf3", label: "PIN Profil", value: "4321", isSecret: true },
    ],
  },
  {
    title: "Spotify", categoryLabel: "Hiburan",
    iconType: "emoji", iconValue: "🎵", iconColor: "#10B981",
    email: "agus@gmail.com", password: "Sp0t1fy#Music",
    url: "https://spotify.com", isFavorite: false, customFields: [],
  },
  {
    title: "YouTube Premium", categoryLabel: "Hiburan",
    iconType: "emoji", iconValue: "▶️", iconColor: "#EF4444",
    email: "agus@gmail.com", password: "Y0uTub3$",
    url: "https://youtube.com", isFavorite: false, customFields: [],
  },
  {
    title: "Disney+ Hotstar", categoryLabel: "Hiburan",
    iconType: "emoji", iconValue: "🎬", iconColor: "#2563EB",
    email: "agus@gmail.com", password: "D1sney+2024",
    url: "https://hotstar.com", isFavorite: false, customFields: [],
  },
  {
    title: "GitHub", categoryLabel: "Work",
    iconType: "emoji", iconValue: "💻", iconColor: "#6B7280",
    username: "agusmido", email: "agus@gmail.com",
    password: "G1tHub$Dev!", url: "https://github.com",
    isFavorite: true,
    customFields: [
      { id: "cf4", label: "Personal Token", value: "ghp_xxxxxxxxxxxx", isSecret: true },
    ],
  },
  {
    title: "Notion", categoryLabel: "Work",
    iconType: "emoji", iconValue: "📋", iconColor: "#6B7280",
    email: "agus@gmail.com", password: "N0t10n#Work",
    url: "https://notion.so", isFavorite: false, customFields: [],
  },
  {
    title: "Figma", categoryLabel: "Work",
    iconType: "emoji", iconValue: "🎨", iconColor: "#EC4899",
    email: "agus@gmail.com", password: "F1gm@Design$",
    url: "https://figma.com", isFavorite: false, customFields: [],
  },
  {
    title: "Canva", categoryLabel: "Work",
    iconType: "emoji", iconValue: "🎨", iconColor: "#06B6D4",
    email: "agus@gmail.com", password: "C@nv@2024!",
    url: "https://canva.com", isFavorite: false, customFields: [],
  },
];

export const seedVaultData = async (userId: string): Promise<number> => {
  // Ambil categories dari local DB untuk resolve label → id
  const categories = await getLocalCategories(userId);

  // Buat map label → id (case insensitive)
  const categoryMap = new Map<string, string>();
  categories.forEach((cat) => {
    categoryMap.set(cat.label.toLowerCase(), cat.id);
  });

  console.log("Category map:", Object.fromEntries(categoryMap));

  // Fallback ke "Lainnya" jika label tidak ketemu
  const fallbackId = categories.find(
    (c) => c.label.toLowerCase() === "lainnya"
  )?.id ?? categories[categories.length - 1]?.id ?? "";

  let count = 0;
  for (const data of SEED_DATA) {
    try {
      // Resolve categoryLabel → categoryId
      const categoryId = categoryMap.get(data.categoryLabel.toLowerCase())
        ?? fallbackId;

      console.log(`Seeding: ${data.title} → category: ${data.categoryLabel} → id: ${categoryId}`);

      await createLocalVaultItem(userId, {
        title: data.title ?? "Untitled",
        categoryId,
        isFavorite: data.isFavorite ?? false,
        iconType: data.iconType ?? "emoji",
        iconValue: data.iconValue ?? "🔐",
        iconColor: data.iconColor ?? "#2563EB",
        username: data.username ?? "",
        email: data.email ?? "",
        password: data.password ?? "",
        pin: data.pin ?? "",
        phone: data.phone ?? "",
        url: data.url ?? "",
        notes: data.notes ?? "",
        holderName: "",
        expiredDate: "",
        customFields: data.customFields ?? [],
      });
      count++;
    } catch (e) {
      console.error("Seed error for", data.title, e);
    }
  }

  console.log(`Seeded ${count} items`);
  return count;
};

// Hapus semua vault items lokal milik user
export const clearLocalVaultData = async (userId: string): Promise<void> => {
  const db = await getDb();
  await db.runAsync(
    "DELETE FROM vault_items WHERE user_id = ?",
    [userId]
  );
  console.log("Local vault data cleared for user:", userId);
};

// Hapus semua di Supabase milik user
export const clearRemoteVaultData = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from("vault_items")
    .delete()
    .eq("user_id", userId);

  if (error) console.error("Clear remote error:", error);
  else console.log("Remote vault data cleared");
};

// Reset total + seed ulang
export const resetAndSeed = async (userId: string): Promise<number> => {
  console.log("=== RESET AND SEED START ===");

  // 1. Hapus lokal
  await clearLocalVaultData(userId);

  // 2. Hapus di Supabase
  await clearRemoteVaultData(userId);

  // 3. Seed ulang
  const count = await seedVaultData(userId);

  console.log(`=== RESET AND SEED DONE: ${count} items ===`);
  return count;
};