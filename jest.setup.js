require('@testing-library/jest-native/extend-expect');
import "react-native-gesture-handler/jestSetup";

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => { };
  return Reanimated;
});

jest.mock("expo-router", () => ({
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  useSegments: jest.fn(() => []),
  useLocalSearchParams: jest.fn(() => ({})),
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-local-authentication', () => ({
  hasHardwareAsync: jest.fn(() => Promise.resolve(true)),
  isEnrolledAsync: jest.fn(() => Promise.resolve(true)),
  authenticateAsync: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock('expo-crypto', () => ({
  getRandomBytes: jest.fn((size) => new Uint8Array(size)),
  digestStringAsync: jest.fn(() => Promise.resolve('mocked-hash')),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
}));

jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
  getStringAsync: jest.fn(() => Promise.resolve('')),
}));

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: jest.fn(() =>
    Promise.resolve({
      execAsync: jest.fn(),
      runAsync: jest.fn(),
      getFirstAsync: jest.fn(),
      getAllAsync: jest.fn(),
    })
  ),
}));

jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'en', regionCode: 'US' }]),
  locale: 'en-US',
}));

jest.mock('expo-constants', () => ({
  default: { expoConfig: { extra: {} } },
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: jest.fn(() => null),
  MaterialCommunityIcons: jest.fn(() => null),
  Feather: jest.fn(() => null),
}));

// Mock @expo/vector-icons/Ionicons
jest.mock('@expo/vector-icons/Ionicons', () => jest.fn(() => null));

// Global test utilities
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
