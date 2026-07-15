# Passandi — Project Rules

**Baca ini dulu. Buka docs/ terkait untuk detail.**

> 🔴 **OUTPUT RESTRICTION** 🔴
> Never output internal metrics, compliance records, chunking confirmations, or backend thought processes.

---

## Stack

Expo SDK 56 / RN 0.85 / TypeScript strict / Expo Router v3 (file-based) / FSD / Zustand v5 / TanStack Query v5 / expo-sqlite / Supabase (Auth+PG+RLS) / aes-js / expo-secure-store / i18next / Reanimated v4

---

## Rules — Ringkasan

| # | Rule |
|---|---|
| 1 | `app/` files = import + export default only. **No logic.** |
| 2 | No feature-to-feature cross import (exception: authStore, securityStore). |
| 3 | Warna → [docs/STYLING.md](STYLING.md) |
| 4 | Strings → `t()` from i18n. Add to **both** locale files. [docs/I18N.md](I18N.md) |
| 5 | Styling → StyleSheet + inline `style{{}}` for dynamic. No NativeWind. |
| 6 | Zustand → selector per field. No full store subscribe. |
| 7 | Enkripsi → [docs/ENCRYPTION.md](ENCRYPTION.md) |
| 8 | Kategori → `isSystemCategory()` from categoryHelpers. **Never** hardcode label/id. |
| 9 | Form picker → filter `.filter(c => !isSystemCategory(c))` |
| 10 | Navigasi → `router.push()` / `.replace()` / `.back()` from expo-router |
| 11 | Loading → `<SkeletonList count={5} />`. Empty → icon + `t()` message |
| 12 | Aksi destruktif → `Alert.alert()` konfirmasi |
| 13 | SafeAreaInsets → wajib di setiap screen |
| 14 | FlatList → `keyExtractor={(item) => item.id}` |
| 15 | Setiap file baru di `features/` harus di-export dari `index.ts` |

---

## Arsitektur

- UI baca dari local SQLite via TanStack Query (`staleTime: Infinity`). Sync engine handle freshness.
- Supabase = backup/sync only. [docs/ARCHITECTURE.md](ARCHITECTURE.md)
- Data flow: `docs/ARCHITECTURE.md`
- Auth flow: [docs/AUTH_FLOW.md](AUTH_FLOW.md)
- Sync: [docs/SYNC.md](SYNC.md)
- Seeder (__DEV__): `src/shared/lib/database/seeder.ts`

---

## Environment

Always via `process.env.EXPO_PUBLIC_*`. Never hardcode. [docs/ENCRYPTION.md](ENCRYPTION.md)

---

## Daftar Docs

| File | Isi |
|---|---|
| [docs/ARCHITECTURE.md](ARCHITECTURE.md) | Stack, folder structure, FSD rules, data flow, feature additions |
| [docs/STYLING.md](STYLING.md) | Theme tokens, brand colors, StyleSheet patterns |
| [docs/I18N.md](I18N.md) | i18n rules, locale locations |
| [docs/ENCRYPTION.md](ENCRYPTION.md) | Enc/dec rules, env vars |
| [docs/AUTH_FLOW.md](AUTH_FLOW.md) | Auth flow diagram, PinPad configs |
| [docs/SYNC.md](SYNC.md) | Sync triggers, status, dev tools |

---

*Passandi — Melawan Rumitnya Keamanan dengan Kesederhanaan*
