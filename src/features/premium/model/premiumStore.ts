import { create } from 'zustand';
import { supabase } from '@/shared/lib/supabase';
import { SubscriptionTier } from '@/shared/config/subscription';
import { isPremium } from '@/shared/lib/premium/premiumUtils';
import type { Product, Purchase } from '@/shared/lib/iap/iapManager';
import {
  ensureConnected as connectIap,
  fetchProducts,
  requestPurchase,
  finishPurchase,
  getAvailablePurchases,
  restorePurchases as restoreIap,
  saveReceipt,
  loadReceipt,
} from '@/shared/lib/iap/iapManager';

type PurchaseStatus =
  | 'idle'
  | 'loading_products'
  | 'ready'
  | 'purchasing'
  | 'restoring'
  | 'success'
  | 'error';

type PremiumState = {
  subscriptionTier: SubscriptionTier;
  isLoading: boolean;
  lastChecked: number | null;
  purchaseStatus: PurchaseStatus;
  purchaseError: string | null;
  products: Product[];
  connected: boolean;

  setSubscriptionTier: (tier: SubscriptionTier) => void;
  checkPremiumStatus: (userId: string) => Promise<void>;
  activatePremium: (userId: string) => Promise<boolean>;
  resetPremium: () => void;
  isPremium: () => boolean;

  initIap: (productIds: string[]) => Promise<void>;
  buyPremium: (productId: string, userId: string) => Promise<void>;
  handlePurchaseResult: (purchase: Purchase, userId: string) => Promise<void>;
  restorePremium: (userId: string) => Promise<string | null>;
  clearPurchaseError: () => void;
  resetPurchaseStatus: () => void;
};

export const usePremiumStore = create<PremiumState>((set, get) => ({
  subscriptionTier: 'free',
  isLoading: false,
  lastChecked: null,
  purchaseStatus: 'idle',
  purchaseError: null,
  products: [],
  connected: false,

  setSubscriptionTier: (tier) => {
    set({ subscriptionTier: tier, lastChecked: Date.now() });
  },

  checkPremiumStatus: async (userId) => {
    set({ isLoading: true });
    try {
      const receipt = await loadReceipt(userId);
      if (receipt && receipt.length > 0) {
        set({ subscriptionTier: 'premium', lastChecked: Date.now(), isLoading: false });
        return;
      }

      const { data, error } = await supabase.rpc('get_premium_status', {
        p_user_id: userId,
      });

      if (error) throw error;

      const tier: SubscriptionTier = data?.is_premium ? 'premium' : 'free';
      set({ subscriptionTier: tier, lastChecked: Date.now(), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  activatePremium: async (userId) => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.rpc('activate_premium', {
        p_user_id: userId,
        p_product_id: 'passandi_premium_lifetime',
        p_order_id: 'manual_' + Date.now(),
        p_purchase_time: Date.now(),
        p_platform: 'ios',
      });

      if (error) throw error;

      await saveReceipt(userId, {
        productId: 'passandi_premium_lifetime',
        orderId: 'manual_' + Date.now(),
        purchaseTime: Date.now(),
        acknowledged: true,
      });

      set({ subscriptionTier: 'premium', isLoading: false });
      return true;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  resetPremium: () => {
    set({ subscriptionTier: 'free', isLoading: false, lastChecked: null });
  },

  isPremium: () => isPremium(get().subscriptionTier),

  // ── IAP Actions ──

  initIap: async (productIds) => {
    if (!get().connected) {
      const result = await connectIap();
      if (!result.success) {
        set({ purchaseStatus: 'error', purchaseError: result.error });
        return;
      }
      set({ connected: true });
    }

    set({ purchaseStatus: 'loading_products' });
    const result = await fetchProducts(productIds);
    if (result.success) {
      set({ products: result.data, purchaseStatus: 'ready' });
    } else {
      set({ purchaseStatus: 'error', purchaseError: result.error });
    }
  },

  buyPremium: async (productId, _userId) => {
    set({ purchaseStatus: 'purchasing', purchaseError: null });
    const result = await requestPurchase(productId);
    if (!result.success) {
      set({ purchaseStatus: 'error', purchaseError: result.error });
    }
    // Purchase result handled by purchaseUpdatedListener → handlePurchaseResult
  },

  handlePurchaseResult: async (purchase, userId) => {
    await finishPurchase(purchase, false);

    await saveReceipt(userId, {
      productId: purchase.productId,
      orderId: purchase.id,
      purchaseTime: purchase.transactionDate ?? Date.now(),
      acknowledged: true,
    });

    // Persist to Supabase
    await supabase.rpc('activate_premium', {
      p_user_id: userId,
      p_product_id: purchase.productId,
      p_order_id: purchase.id,
      p_purchase_time: purchase.transactionDate ?? Date.now(),
      p_platform: purchase.store === 'google' ? 'android' : 'ios',
    });

    set({ subscriptionTier: 'premium', purchaseStatus: 'success' });
  },

  restorePremium: async (userId) => {
    set({ purchaseStatus: 'restoring', purchaseError: null });

    // Step 1: trigger platform restore
    const restoreResult = await restoreIap();
    if (!restoreResult.success) {
      set({ purchaseStatus: 'error', purchaseError: restoreResult.error });
      return null;
    }

    // Step 2: get available purchases
    const availResult = await getAvailablePurchases();
    if (!availResult.success) {
      set({ purchaseStatus: 'error', purchaseError: availResult.error });
      return null;
    }

    const valid = availResult.data.filter(
      (p) => p.productId === 'passandi_premium_lifetime' && p.purchaseState === 'purchased',
    );

    if (valid.length === 0) {
      set({ purchaseStatus: 'idle' });
      return null;
    }

    for (const p of valid) {
      await get().handlePurchaseResult(p, userId);
    }
    return 'restored';
  },

  clearPurchaseError: () => {
    set({ purchaseError: null, purchaseStatus: 'idle' });
  },

  resetPurchaseStatus: () => {
    set({ purchaseStatus: 'idle', purchaseError: null });
  },
}));

export function useSubscriptionTier(): SubscriptionTier {
  return usePremiumStore((s) => s.subscriptionTier);
}

export function useIsPremium(): boolean {
  return usePremiumStore((s) => s.isPremium());
}

export function useIsPremiumLoading(): boolean {
  return usePremiumStore((s) => s.isLoading);
}

export function usePurchaseStatus(): PurchaseStatus {
  return usePremiumStore((s) => s.purchaseStatus);
}

export function usePurchaseError(): string | null {
  return usePremiumStore((s) => s.purchaseError);
}

export function useProducts(): Product[] {
  return usePremiumStore((s) => s.products);
}
