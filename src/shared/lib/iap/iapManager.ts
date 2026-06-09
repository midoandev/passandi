/**
 * In-App Purchase manager for Passandi Premium
 * Wraps expo-iap with graceful fallback in Expo Go
 */

import * as SecureStore from 'expo-secure-store';
import type { Product, Purchase } from 'expo-iap';

let Iap: typeof import('expo-iap') | null = null;

// Load JS module — native module will be detected at call time
try {
  Iap = require('expo-iap');
} catch {
  // Expo Go — package not installed
}

const IAP_RECEIPT_KEY = 'passandi_iap_receipt';

export type IapResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type PurchaseState = {
  productId: string;
  orderId: string;
  purchaseTime: number;
  acknowledged: boolean;
};

export type { Product, Purchase };

/** Check if native module is available by trying initConnection. */
let _nativeReady: boolean | null = null;
async function ensureNative(): Promise<boolean> {
  if (_nativeReady !== null) return _nativeReady;
  if (!Iap) {
    _nativeReady = false;
    return false;
  }
  try {
    await Iap.initConnection();
    _nativeReady = true;
    return true;
  } catch {
    _nativeReady = false;
    return false;
  }
}

export async function ensureConnected(): Promise<IapResult> {
  const ok = await ensureNative();
  if (!ok) return { success: false, error: 'IAP not available' };
  return { success: true, data: undefined };
}

export async function disconnectIap(): Promise<void> {
  if (!Iap) return;
  try {
    await Iap.endConnection();
  } catch {
    // silent
  }
  _nativeReady = null;
}

export async function fetchProducts(
  skus: string[],
): Promise<IapResult<Product[]>> {
  const ok = await ensureNative();
  if (!ok) return { success: false, error: 'IAP not available' };
  try {
    const products = await Iap!.fetchProducts({ skus, type: 'in-app' });
    return { success: true, data: products as Product[] };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Failed to fetch products' };
  }
}

export async function requestPurchase(
  productId: string,
): Promise<IapResult> {
  const ok = await ensureNative();
  if (!ok) return { success: false, error: 'IAP not available' };
  try {
    await Iap!.requestPurchase({
      request: {
        apple: { sku: productId },
        google: { skus: [productId] },
      },
      type: 'in-app',
    });
    return { success: true, data: undefined };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Purchase failed' };
  }
}

export async function finishPurchase(
  purchase: Purchase,
  isConsumable = false,
): Promise<IapResult> {
  const ok = await ensureNative();
  if (!ok) return { success: false, error: 'IAP not available' };
  try {
    await Iap!.finishTransaction({ purchase, isConsumable });
    return { success: true, data: undefined };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Failed to finish transaction' };
  }
}

export async function getAvailablePurchases(): Promise<IapResult<Purchase[]>> {
  const ok = await ensureNative();
  if (!ok) return { success: false, error: 'IAP not available' };
  try {
    const purchases = await Iap!.getAvailablePurchases();
    return { success: true, data: purchases as Purchase[] };
  } catch (e: any) {
    return {
      success: false,
      error: e?.message ?? 'Failed to get available purchases',
    };
  }
}

export async function restorePurchases(): Promise<IapResult> {
  const ok = await ensureNative();
  if (!ok) return { success: false, error: 'IAP not available' };
  try {
    await Iap!.restorePurchases();
    return { success: true, data: undefined };
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Failed to restore purchases' };
  }
}

export async function saveReceipt(
  userId: string,
  purchase: PurchaseState,
): Promise<void> {
  const key = `${IAP_RECEIPT_KEY}_${userId}`;
  const existing = await loadReceipt(userId);
  const updated = existing ? [...existing, purchase] : [purchase];
  await SecureStore.setItemAsync(key, JSON.stringify(updated));
}

export async function loadReceipt(
  userId: string,
): Promise<PurchaseState[] | null> {
  const key = `${IAP_RECEIPT_KEY}_${userId}`;
  const raw = await SecureStore.getItemAsync(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PurchaseState[];
  } catch {
    return null;
  }
}

export async function clearReceipt(userId: string): Promise<void> {
  const key = `${IAP_RECEIPT_KEY}_${userId}`;
  await SecureStore.deleteItemAsync(key);
}

export function onPurchaseUpdate(
  callback: (purchase: Purchase) => void,
): () => void {
  if (!Iap) return () => {};
  const sub = Iap.purchaseUpdatedListener((purchase) => {
    callback(purchase as Purchase);
  });
  return () => sub.remove();
}

export function onPurchaseError(
  callback: (error: any) => void,
): () => void {
  if (!Iap) return () => {};
  const sub = Iap.purchaseErrorListener((error) => {
    callback(error);
  });
  return () => sub.remove();
}
