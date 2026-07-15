# Sync Engine — Passandi

## Triggers

**Auto sync:**
- Internet kembali online (NetInfo)
- App kembali ke foreground (AppState)
- Setelah mutation (create/update/delete)

**Manual sync:** Tap tombol sync di Vault Screen header.

## Status per Item

| Status | Artinya |
|---|---|
| `pending` | Belum disync |
| `synced` | Sama dengan server |
| `failed` | Gagal sync, akan retry |

## Developer Tools (Hanya `__DEV__`)

```tsx
{__DEV__ && (
  <SettingGroup>
    <SettingRow title="Reset & Seed 25 Data Test" ... />
    <SettingRow title="Hapus Semua Data Test" ... />
  </SettingGroup>
)}
```

Seeder: `src/shared/lib/database/seeder.ts`

- `seedVaultData(userId)` — tambah 25 item test
- `clearLocalVaultData(userId)` — hapus data lokal
- `clearRemoteVaultData(userId)` — hapus data Supabase
- `resetAndSeed(userId)` — clear + seed ulang
