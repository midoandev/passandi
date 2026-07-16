/**
 * Subscription types and limits configuration
 * Used throughout the app to check premium features
 */

export type SubscriptionTier = 'free' | 'premium';

/**
 * Feature limits per subscription tier
 */
export const SUBSCRIPTION_LIMITS = {
  free: {
    // Vault limits
    maxVaultItems: 10,
    maxCustomCategories: 0,
    maxCustomFields: 0,

    // Feature flags
    canUseBiometric: false,
    canUseCloudSync: false,
    canExportVault: false,
    canUsePasswordGenerator: true, // Basic generator available

    // UI limits
    maxPasswordHistory: 0,
    canCustomizeTheme: false,
  },
  premium: {
    // Vault limits
    maxVaultItems: Infinity,
    maxCustomCategories: Infinity,
    maxCustomFields: Infinity,

    // Feature flags
    canUseBiometric: true,
    canUseCloudSync: true,
    canExportVault: true,
    canUsePasswordGenerator: true,

    // UI limits
    maxPasswordHistory: 10,
    canCustomizeTheme: true,
  },
} as const;

/**
 * Premium feature identifiers
 */
export const PREMIUM_FEATURES = {
  UNLIMITED_ITEMS: 'unlimited_items',
  CUSTOM_CATEGORIES: 'custom_categories',
  CUSTOM_FIELDS: 'custom_fields',
  BIOMETRIC_LOCK: 'biometric_lock',
  CLOUD_SYNC: 'cloud_sync',
  EXPORT_VAULT: 'export_vault',
  PASSWORD_GENERATOR: 'password_generator',
} as const;

/**
 * Premium pricing configuration
 */
export const PREMIUM_PRICING = {
  monthly: {
    priceIDR: 15000,
    priceUSD: 0.99,
    sku: 'passandi_pro_monthly',
    label: 'PRO MONTHLY',
  },
  yearly: {
    priceIDR: 120000,
    priceUSD: 7.99,
    sku: 'passandi_pro_yearly',
    label: 'PRO YEARLY',
    discount: 33, // % hemat dibanding monthly
  },
} as const;

/**
 * Platform-specific product IDs for IAP
 * These must match Google Play Console and App Store Connect entries.
 * For testing, use Google Play test SKUs (android.test.purchased, etc.)
 */
export const PREMIUM_PRODUCT_IDS = {
  production: {
    ios: ['passandi_pro_monthly', 'passandi_pro_yearly'] as string[],
    android: ['passandi_pro_monthly', 'passandi_pro_yearly'] as string[],
  },
  test: {
    ios: [] as string[], // Use StoreKit Testing in Xcode
    android: ['android.test.purchased'] as string[],
  },
} as const;

/**
 * Feature display names for UI
 */
export const FEATURE_NAMES = {
  [PREMIUM_FEATURES.UNLIMITED_ITEMS]: 'Unlimited Vault Items',
  [PREMIUM_FEATURES.CUSTOM_CATEGORIES]: 'Custom Categories',
  [PREMIUM_FEATURES.CUSTOM_FIELDS]: 'Custom Fields',
  [PREMIUM_FEATURES.BIOMETRIC_LOCK]: 'Biometric Lock',
  [PREMIUM_FEATURES.CLOUD_SYNC]: 'Auto Cloud Sync',
  [PREMIUM_FEATURES.EXPORT_VAULT]: 'Export Vault',
  [PREMIUM_FEATURES.PASSWORD_GENERATOR]: 'Advanced Password Generator',
} as const;
