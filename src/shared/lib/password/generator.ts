type GenerateOptions = {
  length?: number;
  useUppercase?: boolean;
  useLowercase?: boolean;
  useNumbers?: boolean;
  useSymbols?: boolean;
};

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

const getRandomChar = (chars: string): string =>
  chars[Math.floor(Math.random() * chars.length)];

export const generatePassword = ({
  length = 16,
  useUppercase = true,
  useLowercase = true,
  useNumbers = true,
  useSymbols = true,
}: GenerateOptions = {}): string => {
  let pool = "";
  if (useUppercase) pool += UPPERCASE;
  if (useLowercase) pool += LOWERCASE;
  if (useNumbers) pool += NUMBERS;
  if (useSymbols) pool += SYMBOLS;

  if (!pool) return "";

  // Ensure at least one char from each selected set
  const password: string[] = [];
  if (useUppercase) password.push(getRandomChar(UPPERCASE));
  if (useLowercase) password.push(getRandomChar(LOWERCASE));
  if (useNumbers) password.push(getRandomChar(NUMBERS));
  if (useSymbols) password.push(getRandomChar(SYMBOLS));

  // Fill the rest
  while (password.length < length) {
    password.push(getRandomChar(pool));
  }

  // Shuffle
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
};
