# Architecture — Passandi

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Expo SDK 56 + React Native 0.85 |
| Language | TypeScript strict mode |
| Navigation | Expo Router v3 (file-based) |
| Architecture | Feature-Sliced Design (FSD) |
| State (client) | Zustand v5 |
| State (server) | TanStack Query v5 |
| Local DB | expo-sqlite |
| Backend | Supabase (Auth + PostgreSQL + RLS) |
| Enkripsi | aes-js (AES-256-CBC) + expo-crypto |
| Secure Storage | expo-secure-store |

---

## Struktur Folder

```
passandi/
├── app/                        # Expo Router routes ONLY
│   ├── _layout.tsx
│   ├── index.tsx               # Entry redirect
│   ├── (auth)/                 # Auth flow
│   │   ├── _layout.tsx
│   │   ├── login.tsx / register.tsx / setup-pin.tsx
│   │   ├── setup-success.tsx / unlock.tsx
│   └── (app)/                  # Main app (tab navigator)
│       ├── _layout.tsx
│       ├── vault.tsx / vault-form.tsx / vault-detail.tsx
│       ├── category.tsx
│       └── settings*.tsx
│
└── src/
    ├── features/
    │   ├── auth/    → model/ (authStore.ts, securityStore.ts), ui/
    │   ├── vault/   → api/ (vaultApi.ts, categoryApi.ts), model/ (useVaultQuery.ts, vaultStore.ts), ui/
    │   └── settings/ → ui/
    ├── entities/vault/  → types.ts
    ├── shared/
    │   ├── config/    → ThemeContext.tsx, theme.ts, settingsStore.ts, categoryHelpers.ts
    │   ├── lib/       → supabase.ts, encryption.ts, database/ (db.ts, seeder.ts), i18n/, sync/
    │   └── ui/        → Atom components (AppBar, AppButton, AppInput, AppIcon, PinPad, SkeletonItem, SyncIndicator)
    └── widgets/
```

---

## Aturan FSD

### Route Files — Hanya Re-export

File di `app/` **hanya boleh** berisi import dan default export. Tidak boleh logic, state, JSX.

```tsx
// ✅ BENAR
import { VaultScreen } from "@/features/vault";
export default VaultScreen;
```

### Feature Isolation — Tidak Boleh Cross-import

Feature tidak boleh import dari feature lain. Pengecualian: `authStore` dan `securityStore` (global session state).

```ts
// ✅ BENAR
import { useAuthStore } from "@/features/auth/model/authStore";
```

### Data Flow

```
User Action → TanStack Query Mutation → Local SQLite (vaultApi/categoryApi)
    → Cache Invalidate → UI update instant
    → syncStore.startSync() → syncEngine → Supabase (jika online)
```

Aturan:
- UI selalu baca dari local SQLite via TanStack Query
- Supabase hanya backup/sync — bukan primary source saat runtime
- `staleTime: Infinity` untuk vault items — sync engine handle freshness

### Zustand — Selalu Selector Spesifik

```ts
const loading = useAuthStore((s) => s.loading);  // ✅
const { loading, error } = useAuthStore();        // ❌
```

### Kategori Sistem — Identifikasi dengan sort_order

- `sort_order 0` = "Semua" (show all)
- `sort_order 1` = "Favorit" (filter isFavorite)
- `sort_order 2+` = kategori custom/default

Gunakan helpers, jangan hardcode label/id:

```ts
import { isAllCategory, isFavoriteCategory, isSystemCategory } from "@/shared/config/categoryHelpers";
```

Form tambah/edit vault item: filter `.filter((c) => !isSystemCategory(c))`.

### Navigasi — Expo Router

```ts
import { router } from "expo-router";
router.push("/(app)/vault-form");
router.push({ pathname: "/(app)/vault-detail", params: { id: item.id } });
router.replace("/(auth)/login");
router.back();
```

### FlatList — Wajib keyExtractor dari ID

```tsx
keyExtractor={(item) => item.id}  // ✅
```

### Aksi Destruktif — Wajib Alert Konfirmasi

```tsx
Alert.alert(t("common.confirm"), t("detail.delete_confirm", { name: item.title }), [
  { text: t("common.cancel"), style: "cancel" },
  { text: t("common.delete"), style: "destructive", onPress: handleDelete },
]);
```

### SafeAreaInsets — Wajib di Setiap Screen

```tsx
const insets = useSafeAreaInsets();
contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 120 }}
```

---

## Menambah Fitur Baru

1. Types di `src/entities/`
2. DB functions di `src/features/[feature]/api/`
3. TanStack Query hooks di `src/features/[feature]/model/`
4. UI component di `src/features/[feature]/ui/`
5. Export dari `src/features/[feature]/index.ts`
6. Route file di `app/` (re-export only)
7. String i18n di kedua locale files
