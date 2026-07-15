# Auth & Security Flow

## Flow

```
App buka → authStore.initialize() → cek Supabase session
    ↓
Tidak ada session → /(auth)/login
Ada session       → securityStore.checkHasPin(userId)
    ↓
Tidak ada PIN → /(auth)/setup-pin
Ada PIN       → /(auth)/unlock
    ↓
Input PIN/Biometrik → verifyPin(userId, pin)
    ↓
Sukses → /(app)/vault
```

## Aturan PinPad

`PinPad` dipakai di 3 tempat dengan konfigurasi berbeda:

```tsx
// Setup PIN (pertama kali)
<PinPad steps={2} currentStep={1|2} ... />

// Unlock (daily)
<PinPad showBiometric={true} onBiometric={handleBiometric}
        footerText="Ganti Akun" onFooterPress={handleSignOut} ... />

// Ganti PIN (settings)
<PinPad steps={3} currentStep={1|2|3}
        iconType="ionicon" icon="keypad" ... />
```
