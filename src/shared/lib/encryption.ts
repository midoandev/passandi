import * as ExpoCrypto from "expo-crypto";
import * as aesjs from "aes-js";

const getKey = async (userId: string): Promise<Uint8Array> => {
  const salt = process.env.EXPO_PUBLIC_VAULT_SALT ?? "dev_vault_salt";
  const digest = await ExpoCrypto.digestStringAsync(
    ExpoCrypto.CryptoDigestAlgorithm.SHA256,
    userId + salt,
    { encoding: ExpoCrypto.CryptoEncoding.HEX }
  );
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(digest.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
};

const randomIV = (): Uint8Array => {
  const iv = new Uint8Array(16);
  for (let i = 0; i < 16; i++) {
    iv[i] = Math.floor(Math.random() * 256);
  }
  return iv;
};

const pkcs7Pad = (data: Uint8Array): Uint8Array => {
  const blockSize = 16;
  const padLen = blockSize - (data.length % blockSize);
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

// Format enkripsi kita:
// - Pure hex string (0-9, a-f)
// - Minimal 64 hex chars (IV 16 bytes + data min 16 bytes = 32+32)
// - Panjang kelipatan 32 (karena tiap byte = 2 hex char, dan block 16 bytes)
const isValidEncrypted = (text: string): boolean => {
  if (!text || typeof text !== "string") return false;
  if (text.length < 64) return false;
  if (text.length % 32 !== 0) return false;  // IV(32) + blocks(32 each)
  return /^[0-9a-fA-F]+$/.test(text);
};

export const encrypt = async (
  text: string,
  userId: string
): Promise<string> => {
  if (!text) return "";
  try {
    const key = await getKey(userId);
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

export const decrypt = async (
  cipherHex: string,
  userId: string
): Promise<string> => {
  if (!cipherHex) return "";

  // Bukan format enkripsi kita → kembalikan as-is (plain text lama)
  if (!isValidEncrypted(cipherHex)) {
    return cipherHex;
  }

  try {
    const key = await getKey(userId);
    const combined = new Uint8Array(aesjs.utils.hex.toBytes(cipherHex));

    // Double check setelah konversi
    if (combined.length < 32) return cipherHex;

    const iv = combined.slice(0, 16);
    const encrypted = combined.slice(16);

    if (iv.length !== 16) return cipherHex;
    if (encrypted.length === 0) return cipherHex;
    if (encrypted.length % 16 !== 0) return cipherHex;

    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    const decrypted = new Uint8Array(aesCbc.decrypt(encrypted));
    const unpadded = pkcs7Unpad(decrypted);
    return aesjs.utils.utf8.fromBytes(unpadded);
  } catch (e) {
    // Jangan crash — kembalikan string kosong
    return "";
  }
};