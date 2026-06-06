<p align="center">
  <img src="assets/icon.png" width="80" alt="Passandi Logo" />
</p>

<h1 align="center">Passandi</h1>
<p align="center"><em>Melawan Rumitnya Keamanan</em></p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.76-blue?logo=react" />
  <img src="https://img.shields.io/badge/Expo-SDK%2052-black?logo=expo" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Supabase-Backend-green?logo=supabase" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

---

## Tentang Passandi

**Passandi** adalah aplikasi password manager mobile yang mengutamakan keamanan dan kemudahan penggunaan. Dibangun dengan prinsip **Local First** — data tersimpan dan dapat diakses secara lokal tanpa koneksi internet, namun tetap tersinkronisasi ke cloud saat online.

> **"Melawan Rumitnya Keamanan dengan Kesederhanaan."**

---

## Fitur Utama

- 🔐 **Brankas Terenkripsi** — semua password tersimpan dengan enkripsi AES-256
- 📱 **Local First** — bisa add/edit/delete tanpa internet, sync otomatis saat online
- 🔢 **PIN & Biometrik** — masuk cepat dengan PIN 6 digit atau FaceID/Fingerprint
- 🗂️ **Kategori Custom** — organisir akun sesuai kebutuhan dengan drag-to-reorder
- ⭐ **Favorit** — tandai akun penting untuk akses cepat
- 🌙 **Dark / Light Mode** — tema otomatis mengikuti sistem
- 🌐 **Multi Bahasa** — Indonesia & English
- 📋 **Copy ke Clipboard** — salin password, username, email dengan satu tap
- 🔍 **Pencarian Cepat** — cari akun secara real-time
- 🔄 **Sync Otomatis** — sinkronisasi ke Supabase saat koneksi tersedia

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| Framework | Expo SDK 52 + React Native 0.76 |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router v3 (file-based) |
| Architecture | Feature-Sliced Design (FSD) |
| State | Zustand |
| Server State | TanStack Query v5 |
| Local DB | expo-sqlite |
| Backend | Supabase (Auth + PostgreSQL + RLS) |
| Enkripsi | aes-js (AES-256-CBC) |
| Animasi | React Native Reanimated v3 |
| Gesture | React Native Gesture Handler |
| Icons | @expo/vector-icons (Ionicons) |
| i18n | i18next + react-i18next |
| Secure Storage | expo-secure-store |
| Biometrik | expo-local-authentication |

---

## Struktur Proyek

```
passandi/
├── app/                          # Expo Router — routes only
│   ├── _layout.tsx               # Root layout (providers, AuthGate)
│   ├── index.tsx                 # Entry redirect
│   ├── (auth)/                   # Auth flow group
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── setup-pin.tsx
│   │   ├── setup-success.tsx
│   │   └── unlock.tsx
│   └── (app)/                    # Main app group
│       ├── vault.tsx
│       ├── vault-form.tsx
│       ├── vault-detail.tsx
│       ├── category.tsx
│       ├── settings.tsx
│       ├── settings-profile.tsx
│       ├── settings-sessions.tsx
│       └── settings-pin.tsx
│
├── src/
│   ├── features/                 # Fitur independen (FSD)
│   │   ├── auth/
│   │   │   ├── model/
│   │   │   │   ├── authStore.ts       # Zustand auth state
│   │   │   │   └── securityStore.ts   # PIN management
│   │   │   └── ui/
│   │   │       ├── LoginScreen.tsx
│   │   │       ├── RegisterScreen.tsx
│   │   │       ├── SetupPinScreen.tsx
│   │   │       ├── SetupSuccessScreen.tsx
│   │   │       └── UnlockScreen.tsx
│   │   │
│   │   ├── vault/
│   │   │   ├── api/
│   │   │   │   ├── vaultApi.ts        # CRUD local SQLite
│   │   │   │   └── categoryApi.ts     # Categories CRUD
│   │   │   ├── model/
│   │   │   │   ├── useVaultQuery.ts   # TanStack Query hooks
│   │   │   │   └── vaultStore.ts      # UI state (filter, search)
│   │   │   └── ui/
│   │   │       ├── VaultScreen.tsx
│   │   │       ├── VaultFormScreen.tsx
│   │   │       ├── VaultDetailScreen.tsx
│   │   │       ├── VaultItemCard.tsx
│   │   │       ├── CategoryScreen.tsx
│   │   │       ├── CategoryFormSheet.tsx
│   │   │       ├── DraggableCategoryRow.tsx
│   │   │       ├── DetailField.tsx
│   │   │       └── IconPickerSheet.tsx
│   │   │
│   │   └── settings/
│   │       └── ui/
│   │           ├── SettingsScreen.tsx
│   │           ├── SettingsProfileScreen.tsx
│   │           ├── SettingsPinScreen.tsx
│   │           └── SettingsSessionsScreen.tsx
│   │
│   ├── entities/                 # Data models & types
│   │   └── vault/
│   │       ├── types.ts          # VaultItem, VaultCategory, etc.
│   │       └── index.ts
│   │
│   ├── shared/                   # Reusable code
│   │   ├── config/
│   │   │   ├── ThemeContext.tsx   # Dark/Light theme tokens
│   │   │   ├── theme.ts          # Brand colors
│   │   │   └── settingsStore.ts  # Language preference
│   │   ├── lib/
│   │   │   ├── supabase.ts       # Supabase client
│   │   │   ├── encryption.ts     # AES-256 encrypt/decrypt
│   │   │   ├── database/
│   │   │   │   └── db.ts         # expo-sqlite setup & schema
│   │   │   ├── i18n/
│   │   │   │   ├── index.ts
│   │   │   │   └── locales/
│   │   │   │       ├── id.ts     # Bahasa Indonesia
│   │   │   │       └── en.ts     # English
│   │   │   └── sync/
│   │   │       ├── syncEngine.ts     # Push/pull logic
│   │   │       ├── syncStore.ts      # Sync status state
│   │   │       ├── useNetworkSync.ts # Auto sync hook
│   │   │       └── usePendingCount.ts
│   │   └── ui/                   # Shared components
│   │       ├── AppBar.tsx
│   │       ├── AppButton.tsx
│   │       ├── AppInput.tsx
│   │       ├── AppIcon.tsx
│   │       ├── PinPad.tsx        # Reusable PIN numpad
│   │       ├── SkeletonItem.tsx
│   │       └── SyncIndicator.tsx
│   │
│   └── widgets/                  # Composite components
│
├── assets/                       # Images, fonts, icons
├── .env                          # Environment variables (git ignored)
├── .env.example                  # Template env
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
├── babel.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## Memulai

### Prasyarat

- Node.js v20+
- npm / yarn
- Expo Go app (untuk development)
- Akun Supabase

### Instalasi

```bash
# Clone repository
git clone https://github.com/username/passandi.git
cd passandi

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

### Environment Variables

Buat file `.env` di root project:

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Security — gunakan string random minimal 32 karakter
EXPO_PUBLIC_PIN_SALT=your_random_pin_salt_here
EXPO_PUBLIC_VAULT_SALT=your_random_vault_salt_here
```

> ⚠️ **Jangan pernah commit file `.env` ke repository.**
> Gunakan string yang berbeda antara environment development dan production.

### Setup Supabase

Jalankan SQL berikut di **Supabase Dashboard → SQL Editor**:

```sql
-- Vault Items
CREATE TABLE vault_items (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title           TEXT        NOT NULL,
  category_id     TEXT        NOT NULL DEFAULT 'other',
  is_favorite     BOOLEAN     DEFAULT false,
  icon_type       TEXT        NOT NULL DEFAULT 'emoji',
  icon_value      TEXT        NOT NULL DEFAULT '🔐',
  icon_color      TEXT        NOT NULL DEFAULT '#2563EB',
  username        TEXT,
  email           TEXT,
  password        TEXT,
  pin             TEXT,
  phone           TEXT,
  url             TEXT,
  notes           TEXT,
  holder_name     TEXT,
  expired_date    TEXT,
  custom_fields   JSONB       DEFAULT '[]',
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Vault Categories
CREATE TABLE vault_categories (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label       TEXT        NOT NULL,
  icon        TEXT        NOT NULL DEFAULT '📁',
  color       TEXT        NOT NULL DEFAULT '#2563EB',
  sort_order  INTEGER     NOT NULL DEFAULT 0,
  is_default  BOOLEAN     NOT NULL DEFAULT false,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE vault_items       ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_categories  ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users own vault items"
  ON vault_items FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users own categories"
  ON vault_categories FOR ALL
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Auto-create default categories for new users
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO vault_categories (user_id, label, icon, color, sort_order, is_default)
  VALUES
    (NEW.id, 'Semua',    '🗂️',  '#2563EB', 0, true),
    (NEW.id, 'Favorit',  '⭐',  '#F59E0B', 1, true),
    (NEW.id, 'Bank',     '🏦',  '#10B981', 2, true),
    (NEW.id, 'Sosmed',   '💬',  '#8B5CF6', 3, true),
    (NEW.id, 'E-Wallet', '💳',  '#EC4899', 4, true),
    (NEW.id, 'Work',     '💼',  '#F59E0B', 5, true),
    (NEW.id, 'Hiburan',  '🎬',  '#EF4444', 6, true),
    (NEW.id, 'Shopping', '🛍️',  '#06B6D4', 7, true),
    (NEW.id, 'Lainnya',  '📁',  '#6B7280', 8, true);
  RETURN NEW;
END; $$;

CREATE TRIGGER on_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_categories();
```

### Menjalankan Development

```bash
# Start development server
npx expo start

# Android (USB/Wireless)
# Tekan 'a' di terminal

# iOS Simulator
# Tekan 'i' di terminal

# Expo Go (scan QR)
# Scan QR code dari terminal
```

---

## Build & Deploy

### APK (Android) — EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Configure (sekali saja)
eas build:configure

# Build APK untuk testing
eas build --platform android --profile preview

# Build App Bundle untuk Play Store
eas build --platform android --profile production
```

### Setup EAS Secrets (Production)

```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://..."
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..."
eas secret:create --scope project --name EXPO_PUBLIC_PIN_SALT --value "..."
eas secret:create --scope project --name EXPO_PUBLIC_VAULT_SALT --value "..."
```

---

## Arsitektur

### Local First Flow

```
User Action (add/edit/delete)
        ↓
  expo-sqlite (Local DB)     ← Instant, no internet needed
        ↓
  sync_status = "pending"
        ↓
  Internet tersedia?
  ├── Ya  → Sync Engine → Supabase
  └── Tidak → Tetap pending, retry saat online
```

### Auth & Security Flow

```
Buka App
  ↓
Supabase session ada?
  ├── Tidak → Login Screen
  └── Ya
        ↓
      PIN di SecureStore ada?  (per userId)
        ├── Tidak → Setup PIN
        └── Ya → Unlock (PIN / Biometrik)
              ↓
           Vault Screen
```

### Enkripsi Data

- **PIN**: Di-hash dengan SHA-256 + salt, disimpan di `expo-secure-store` (iOS Keychain / Android Keystore)
- **Password & PIN vault**: Dienkripsi dengan AES-256-CBC sebelum disimpan ke SQLite dan Supabase
- **Encryption key**: Derived dari `userId + VAULT_SALT` menggunakan SHA-256
- **Salt**: Disimpan di environment variable, tidak pernah di-commit ke repository

---

## Roadmap

- [x] Auth (Email/Password + Google OAuth)
- [x] Setup PIN & Biometrik
- [x] Vault CRUD (Add/Edit/Delete/Detail)
- [x] Kategori dengan drag-to-reorder
- [x] Local First dengan expo-sqlite
- [x] Sync ke Supabase
- [x] Dark/Light Mode
- [x] Multi-bahasa (ID/EN)
- [x] EAS Build (APK)
- [ ] QR Sync (Web Session)
- [ ] Multi-device session management
- [ ] Password strength meter
- [ ] Auto-lock timer
- [ ] Export/Import vault
- [ ] iOS App Store release
- [ ] Android Play Store release

---

## Kontribusi

1. Fork repository ini
2. Buat branch baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: tambah fitur X'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request

---

## Lisensi

MIT License — lihat file [LICENSE](LICENSE) untuk detail.

---

<p align="center">
  Dibuat dengan ❤️ menggunakan React Native & Expo
</p>