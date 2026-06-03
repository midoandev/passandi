import CryptoJS from "crypto-js";

// Key enkripsi derived dari userId + salt
// Data vault dienkripsi sebelum ke Supabase
const getEncryptionKey = (userId: string): string => {
  const salt = process.env.EXPO_PUBLIC_VAULT_SALT ?? "dev_vault_salt";
  return CryptoJS.SHA256(userId + salt).toString();
};

export const encrypt = (text: string, userId: string): string => {
  console.log("ENCRYPT START");

  const key = getEncryptionKey(userId);

  console.log("KEY GENERATED");

  const encrypted = CryptoJS.AES.encrypt(text, key).toString();

  console.log("ENCRYPT SUCCESS");

  return encrypted;
};

export const decrypt = (cipherText: string, userId: string): string => {
  if (!cipherText) return "";
  try {
    const key = getEncryptionKey(userId);
    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};

// Enkripsi field sensitif saja (password, pin)
export const encryptSensitiveFields = (
  form: Record<string, any>,
  userId: string,
): Record<string, any> => {
  const result = { ...form };
  if (result.password) result.password = encrypt(result.password, userId);
  if (result.pin) result.pin = encrypt(result.pin, userId);
  return result;
};

export const decryptSensitiveFields = (
  item: Record<string, any>,
  userId: string,
): Record<string, any> => {
  const result = { ...item };
  if (result.password) result.password = decrypt(result.password, userId);
  if (result.pin) result.pin = decrypt(result.pin, userId);
  return result;
};
