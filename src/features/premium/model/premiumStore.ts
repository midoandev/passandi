import { create } from 'zustand';
import { SubscriptionTier } from '@/shared/config/subscription';
import { isPremium } from '@/shared/lib/premium/premiumUtils';

type PremiumState = {
  subscriptionTier: SubscriptionTier;
  isLoading: boolean;
  lastChecked: number | null;

  setSubscriptionTier: (tier: SubscriptionTier) => void;
  checkPremiumStatus: (userId: string) => Promise<void>;
  activatePremium: (userId: string) => Promise<boolean>;
  resetPremium: () => void;
  isPremium: () => boolean;
};

export const usePremiumStore = create<PremiumState>((set, get) => ({
  subscriptionTier: 'free',
  isLoading: false,
  lastChecked: null,

  setSubscriptionTier: (tier) => {
    set({ subscriptionTier: tier, lastChecked: Date.now() });
  },

  checkPremiumStatus: async (_userId) => {
    set({ isLoading: true });
    try {
      // TODO: Phase 6 — call Supabase RPC
      set({ subscriptionTier: 'free', lastChecked: Date.now(), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  activatePremium: async (_userId) => {
    set({ isLoading: true });
    try {
      // TODO: Phase 6 — call Supabase RPC
      set({ isLoading: false });
      return false;
    } catch {
      set({ isLoading: false });
      return false;
    }
  },

  resetPremium: () => {
    set({ subscriptionTier: 'free', isLoading: false, lastChecked: null });
  },

  isPremium: () => isPremium(get().subscriptionTier),
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
