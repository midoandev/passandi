# Enkripsi — Passandi

## Aturan

Hanya field sensitif yang dienkripsi. Lainnya plain text.

| Field | Perlakukan |
|---|---|
| `password` (vault item) | AES-256-CBC encrypt |
| `pin` (vault item, bukan app PIN) | AES-256-CBC encrypt |
| `title, username, email, phone, url, notes, dll` | Plain text |
| App PIN | SHA-256 hash + salt, simpan di expo-secure-store |

## Detail

- Encryption key derived dari `userId + EXPO_PUBLIC_VAULT_SALT`
- App PIN hash: SHA-256 + `EXPO_PUBLIC_PIN_SALT`
- App PIN key di secure-store: `passandi_pin_hash_{userId}`
- Data plain text **tidak boleh** dikirim ke Supabase

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL      → Supabase project URL
EXPO_PUBLIC_SUPABASE_ANON_KEY → Supabase anon key
EXPO_PUBLIC_PIN_SALT          → Salt untuk hash PIN (min 32 char)
EXPO_PUBLIC_VAULT_SALT        → Salt untuk enkripsi vault (min 32 char)
```

Jangan pernah hardcode nilai-nilai ini di source code — selalu via `process.env.EXPO_PUBLIC_*`.
