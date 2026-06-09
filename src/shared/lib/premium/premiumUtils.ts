/**
 * Premium feature utility functions
 * Used to check premium status and feature availability
 */

import { SubscriptionTier, SUBSCRIPTION_LIMITS } from '@/shared/config/subscription';

/**
 * Check if user has premium subscription
 */
export function isPremium(tier: SubscriptionTier): boolean {
  return tier === 'premium';
}

/**
 * Get subscription tier from string (with fallback)
 */
export function getSubscriptionTier(tier: string | null | undefined): SubscriptionTier {
  if (tier === 'premium') return 'premium';
  return 'free';
}

/**
 * Check if user can add more vault items
 */
export function canAddVaultItem(tier: SubscriptionTier, currentCount: number): boolean {
  const limit = SUBSCRIPTION_LIMITS[tier].maxVaultItems;
  if (limit === Infinity) return true;
  return currentCount < limit;
}

/**
 * Get remaining vault item slots
 */
export function getRemainingVaultSlots(tier: SubscriptionTier, currentCount: number): number {
  const limit = SUBSCRIPTION_LIMITS[tier].maxVaultItems;
  if (limit === Infinity) return Infinity;
  return Math.max(0, limit - currentCount);
}

/**
 * Check if user can create custom categories
 */
export function canCreateCategory(tier: SubscriptionTier, currentCustomCount: number): boolean {
  const limit = SUBSCRIPTION_LIMITS[tier].maxCustomCategories;
  if (limit === 0) return false;
  if (limit === Infinity) return true;
  return currentCustomCount < limit;
}

/**
 * Check if user can add custom fields to vault item
 */
export function canAddCustomField(tier: SubscriptionTier, currentFieldCount: number): boolean {
  const limit = SUBSCRIPTION_LIMITS[tier].maxCustomFields;
  if (limit === 0) return false;
  if (limit === Infinity) return true;
  return currentFieldCount < limit;
}

/**
 * Check if user can use biometric authentication
 */
export function canUseBiometric(tier: SubscriptionTier): boolean {
  return SUBSCRIPTION_LIMITS[tier].canUseBiometric;
}

/**
 * Check if user can use cloud sync
 */
export function canUseCloudSync(tier: SubscriptionTier): boolean {
  return SUBSCRIPTION_LIMITS[tier].canUseCloudSync;
}

/**
 * Check if user can export vault
 */
export function canExportVault(tier: SubscriptionTier): boolean {
  return SUBSCRIPTION_LIMITS[tier].canExportVault;
}

/**
 * Get all locked features for current tier
 */
export function getLockedFeatures(tier: SubscriptionTier): string[] {
  if (tier === 'premium') return [];

  const locked: string[] = [];
  const limits = SUBSCRIPTION_LIMITS[tier];

  if (limits.maxCustomCategories === 0) locked.push('custom_categories');
  if (limits.maxCustomFields === 0) locked.push('custom_fields');
  if (!limits.canUseBiometric) locked.push('biometric_lock');
  if (!limits.canUseCloudSync) locked.push('cloud_sync');
  if (!limits.canExportVault) locked.push('export_vault');

  return locked;
}

// Upgrade messages moved to i18n (premium.* keys)
// Use t('premium.biometric_message') etc. in UI components
