import * as ExpoCrypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import * as aesjs from "aes-js";
import { getSessionPin } from "@/shared/lib/sessionPin";

const VAULT_KEY_STORE = "passandi_vault_key";
const VAULT_KEY_DIRECT = "passandi_vault_key_direct";
const VAULT_KEY_BIOMETRIC_STORE = "passandi_vault_key_biometric";

// ── Key derivation dari PIN ───────────────────────────────────

const pinSalt = process.env.EXPO_PUBLIC_PIN_SALT ?? "dev_fallback_salt";

const deriveKeyFromPin = async (pin: string): Promise<Uint8Array> => {
  const digest = await ExpoCrypto.digestStringAsync(
    ExpoCrypto.CryptoDigestAlgorithm.SHA256,
    pin + pinSalt,
    { encoding: ExpoCrypto.CryptoEncoding.HEX }
  );
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(digest.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

// ── Generate random vault key ─────────────────────────────────

const generateVaultKey = (): Uint8Array => {
  const key = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    key[i] = Math.floor(Math.random() * 256);
  }
  return key;
};

// ── Encrypt/decrypt vault key dengan PIN ──────────────────────

const aesEncryptKey = async (vaultKey: Uint8Array, pinKey: Uint8Array): Promise<string> => {
  const iv = new Uint8Array(16);
  for (let i = 0; i < 16; i++) iv[i] = Math.floor(Math.random() * 256);
  const aes = new aesjs.ModeOfOperation.cbc(pinKey, iv);
  const encrypted = aes.encrypt(vaultKey);
  const combined = new Uint8Array(iv.length + encrypted.length);
  combined.set(iv, 0);
  combined.set(encrypted, iv.length);
  return aesjs.utils.hex.fromBytes(combined);
};

const aesDecryptKey = async (cipherHex: string, pinKey: Uint8Array): Promise<Uint8Array> => {
  const combined = aesjs.utils.hex.toBytes(cipherHex);
  const iv = combined.slice(0, 16);
  const encrypted = combined.slice(16);
  const aes = new aesjs.ModeOfOperation.cbc(pinKey, iv);
  return new Uint8Array(aes.decrypt(encrypted));
};

// ── Public API ────────────────────────────────────────────────

/** Setup vault key for a new PIN — generate key, store encrypted with PIN and raw for sync */
export const setupVaultKey = async (pin: string): Promise<void> => {
  const vaultKey = generateVaultKey();
  const pinKey = await deriveKeyFromPin(pin);
  const encrypted = await aesEncryptKey(vaultKey, pinKey);
  await SecureStore.setItemAsync(VAULT_KEY_STORE, encrypted);
  await SecureStore.setItemAsync(VAULT_KEY_DIRECT, aesjs.utils.hex.fromBytes(vaultKey));
};

/** Ensure direct vault key exists (called after PIN verify) */
export const ensureDirectKey = async (pin: string): Promise<void> => {
  const exists = await SecureStore.getItemAsync(VAULT_KEY_DIRECT);
  if (exists) return;
  const vaultKey = await getKeyFromPin(pin);
  await SecureStore.setItemAsync(VAULT_KEY_DIRECT, aesjs.utils.hex.fromBytes(vaultKey));
};

/** Change PIN — decrypt vault key with old PIN, re-encrypt with new PIN */
export const changeVaultKey = async (oldPin: string, newPin: string): Promise<void> => {
  const encrypted = await SecureStore.getItemAsync(VAULT_KEY_STORE);
  if (!encrypted) return;
  const oldPinKey = await deriveKeyFromPin(oldPin);
  const vaultKey = await aesDecryptKey(encrypted, oldPinKey);
  const newPinKey = await deriveKeyFromPin(newPin);
  const reEncrypted = await aesEncryptKey(vaultKey, newPinKey);
  await SecureStore.setItemAsync(VAULT_KEY_STORE, reEncrypted);
};

/** Get vault key — derived from PIN (for unlock flow) */
const getKeyFromPin = async (pin: string): Promise<Uint8Array> => {
  const encrypted = await SecureStore.getItemAsync(VAULT_KEY_STORE);
  if (!encrypted) throw new Error("Vault key not found");
  const pinKey = await deriveKeyFromPin(pin);
  return aesDecryptKey(encrypted, pinKey);
};

/** Get vault key — from direct or biometric-protected storage (for background/sync) */
const getKeyFromDirect = async (): Promise<Uint8Array> => {
  const hex = await SecureStore.getItemAsync(VAULT_KEY_DIRECT);
  if (hex) return aesjs.utils.hex.toBytes(hex);
  // Fallback ke biometric jika direct tidak ada
  const bioHex = await SecureStore.getItemAsync(VAULT_KEY_BIOMETRIC_STORE);
  if (!bioHex) throw new Error("Vault key not found");
  return aesjs.utils.hex.toBytes(bioHex);
};

/** Store vault key with biometric protection */
export const enableBiometricKey = async (pin: string): Promise<void> => {
  const vaultKey = await getKeyFromPin(pin);
  const hex = aesjs.utils.hex.fromBytes(vaultKey);
  await SecureStore.setItemAsync(VAULT_KEY_BIOMETRIC_STORE, hex, {
    requireAuthentication: true,
  });
};

/** Remove biometric key */
export const disableBiometricKey = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(VAULT_KEY_BIOMETRIC_STORE);
};

/** Delete vault keys (on wipe) */
export const deleteVaultKeys = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(VAULT_KEY_STORE);
  await SecureStore.deleteItemAsync(VAULT_KEY_DIRECT);
  await SecureStore.deleteItemAsync(VAULT_KEY_BIOMETRIC_STORE);
};

// ── Encrypt/Decrypt data ──────────────────────────────────────

const getKey = async (pin?: string): Promise<Uint8Array> => {
  const sessionPin = pin ?? getSessionPin();
  if (sessionPin) return getKeyFromPin(sessionPin);
  return getKeyFromDirect();
};

const randomIV = (): Uint8Array => {
  const iv = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    iv[i] = Math.floor(Math.random() * 256);
  }
  return iv;
};

const pkcs7Pad = (data: Uint8Array): Uint8Array => {
  const padLen = 16 - (data.length % 16);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  padded.fill(padLen, data.length);
  return padded;
};

const pkcs7Unpad = (data: Uint8Array): Uint8Array => {
  if (data.length === 0) return data;
  const padLen = data[data.length - 1];
  if (padLen === 0 || padLen > 16) return data;
  return data.slice(0, data.length - padLen);
};

const isValidEncrypted = (text: string): boolean => {
  if (!text || typeof text !== "string") return false;
  if (text.length < 64) return false;
  if (text.length % 32 !== 0) return false;
  return /^[0-9a-fA-F]+$/.test(text);
};

/** Encrypt text with vault key (via PIN or biometric) */
export const encrypt = async (text: string, pin?: string): Promise<string> => {
  if (!text) return "";
  try {
    const key = await getKey(pin);
    const iv = randomIV();
    const textBytes = aesjs.utils.utf8.toBytes(text);
    const padded = pkcs7Pad(new Uint8Array(textBytes));
    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    const encrypted = aesCbc.encrypt(padded);
    const combined = new Uint8Array(iv.length + encrypted.length);
    combined.set(iv, 0);
    combined.set(encrypted, iv.length);
    return aesjs.utils.hex.fromBytes(combined);
  } catch (e) {
    console.error("Encrypt error:", e);
    return "";
  }
};

/** Decrypt text with vault key (via PIN or biometric) */
export const decrypt = async (cipherHex: string, pin?: string): Promise<string> => {
  if (!cipherHex) return "";
  if (!isValidEncrypted(cipherHex)) return cipherHex;

  try {
    const key = await getKey(pin);
    const combined = aesjs.utils.hex.toBytes(cipherHex);
    if (combined.length < 32) return cipherHex;

    const iv = combined.slice(0, 16);
    const encrypted = combined.slice(16);
    if (iv.length !== 16 || encrypted.length === 0 || encrypted.length % 16 !== 0) return cipherHex;

    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    const decrypted = new Uint8Array(aesCbc.decrypt(encrypted));
    const unpadded = pkcs7Unpad(decrypted);
    return aesjs.utils.utf8.fromBytes(unpadded);
  } catch {
    return "";
  }
};
