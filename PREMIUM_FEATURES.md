# Premium Features Implementation Plan

## 📋 Feature Comparison

### FREE Version
- ✅ **10 vault items maximum**
- ✅ **Default categories only** (fixed, cannot add/edit/delete)
- ✅ **Basic fields only**:
  - Title
  - Username
  - Email
  - Password
  - Notes
  - URL
- ✅ **PIN lock only** (no biometric)
- ✅ **Local storage only** (no cloud sync)
- ✅ **Single vault**
- ✅ **Basic themes** (Dark/Light only)

### PREMIUM Version (Rp 49.000 - One-Time Purchase)
- 💎 **Unlimited vault items**
- 💎 **Custom categories** (create, edit, delete, reorder)
- 💎 **Custom fields** (unlimited fields per item) 🔒
- 💎 **Biometric lock** (Face ID/Fingerprint) 🔒
- 💎 **Auto cloud sync** (Supabase) 🔒
- 💎 **Password generator** (advanced options)
- 💎 **Export vault** (CSV/JSON)
- 💎 **Priority updates**
- 💎 **Lifetime access** (pay once, use forever)

**🔒 = Locked for FREE users**

---

## 🎯 Implementation Checklist

### ✅ Phase 1: Data Layer & Constants (3 operations)
- [ ] Create `src/shared/config/subscription.ts` (Define tiers & limits)
- [ ] Create `src/shared/lib/premium/premiumUtils.ts` (Helper functions)
- [ ] Update database schema (Add subscription_tier field)

### ✅ Phase 2: Business Logic (4 operations)
- [ ] Vault item limit check
- [ ] Custom categories lock
- [ ] Custom fields lock
- [ ] Biometric lock check

### ✅ Phase 3: UI Components (5 operations)
- [ ] Create `PremiumBadge.tsx`
- [ ] Create `UpgradePrompt.tsx`
- [ ] Create `PaywallScreen.tsx`
- [ ] Create `PremiumCard.tsx`
- [ ] Create `UpgradeButton.tsx`

### ✅ Phase 4: Screen Modifications (4 operations)
- [ ] Update `VaultFormScreen.tsx` (item limit + custom fields lock)
- [ ] Update `CategoryScreen.tsx` (custom category lock)
- [ ] Update `SettingsScreen.tsx` (add upgrade section)
- [ ] Update `UnlockScreen.tsx` (biometric lock check)

### ✅ Phase 5: Store & State (2 operations)
- [ ] Create `premiumStore.ts`
- [ ] Update `authStore.ts` (load premium status)

### ✅ Phase 6: Payment Integration (3 operations)
- [ ] Setup Google Play IAP
- [ ] Create `iapManager.ts`
- [ ] Implement purchase flow

### ✅ Phase 7: Backend Integration (2 operations)
- [ ] Supabase premium functions
- [ ] Database tables & RLS

### ✅ Phase 8: Polish & Testing (3 operations)
- [ ] Add premium indicators
- [ ] Test all flows
- [ ] Edge cases handling

**Total: ~26 operations (all <350 lines each)**

---

## 💰 Pricing (CONFIRMED)

```
FREE: Rp 0 (Forever)
PREMIUM: Rp 49.000 (One-time, Lifetime)
```

---

## 📊 Feature Flags

```typescript
export const SUBSCRIPTION_LIMITS = {
  free: {
    maxVaultItems: 10,
    maxCustomCategories: 0,
    maxCustomFields: 0,
    canUseBiometric: false,
    canUseCloudSync: false,
    canExportVault: false,
  },
  premium: {
    maxVaultItems: Infinity,
    maxCustomCategories: Infinity,
    maxCustomFields: Infinity,
    canUseBiometric: true,
    canUseCloudSync: true,
    canExportVault: true,
  },
};
```

---

## 🎨 UI/UX Guidelines

### Premium Badge
- Small "PRO" badge in gold (#F59E0B)
- Placed on locked features

### Paywall Messages
- **Limit Reached:** "You've added 10 items! Upgrade to Premium for unlimited storage."
- **Custom Fields:** "Add unlimited custom fields with Premium."
- **Biometric:** "Unlock faster with Face ID. Available in Premium."
- **Cloud Sync:** "Auto backup to cloud. Upgrade to Premium."

---

## 🚀 Ready to Start Implementation

**Next Step:** Phase 1 - Data Layer (3 operations, all <200 lines each)

**Estimated Timeline:** 2-3 weeks
**All operations will follow CHUNKED WRITE PROTOCOL (<350 lines)**

---

Generated with 💎 by Claude Code on 2026-06-08
