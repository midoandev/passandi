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

// Manual PKCS7 pad
const pkcs7Pad = (data: Uint8Array): Uint8Array => {
  const blockSize = 16;
  const padLen = blockSize - (data.length % blockSize);
  const padded = new Uint8Array(data.length + padLen);
  padded.set(data);
  padded.fill(padLen, data.length);
  return padded;
};

// Manual PKCS7 unpad
const pkcs7Unpad = (data: Uint8Array): Uint8Array => {
  const padLen = data[data.length - 1];
  return data.slice(0, data.length - padLen);
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
  try {
    const key = await getKey(userId);
    const combined = new Uint8Array(aesjs.utils.hex.toBytes(cipherHex));
    const iv = combined.slice(0, 16);
    const encrypted = combined.slice(16);
    const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
    const decrypted = new Uint8Array(aesCbc.decrypt(encrypted));
    const unpadded = pkcs7Unpad(decrypted);
    return aesjs.utils.utf8.fromBytes(unpadded);
  } catch (e) {
    console.error("Decrypt error:", e);
    return "";
  }
};