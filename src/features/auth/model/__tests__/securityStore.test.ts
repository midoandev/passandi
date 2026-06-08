const { useSecurityStore } = require('../securityStore');

const mockUserId = 'user-123-test';
const mockPin = '123456';
const mockHashedPin = 'mocked-hash';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn(() => Promise.resolve(mockHashedPin)),
  CryptoDigestAlgorithm: {
    SHA256: 'SHA-256',
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  useSecurityStore.setState({
    hasPin: false,
    loading: false,
    error: null,
  });
});

describe('useSecurityStore', () => {
  describe('checkHasPin', () => {
    it('should return true when PIN exists', async () => {
      const SecureStore = require('expo-secure-store');
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('true');

      const result = await useSecurityStore.getState().checkHasPin(mockUserId);

      expect(result).toBe(true);
      expect(useSecurityStore.getState().hasPin).toBe(true);
    });

    it('should return false when PIN does not exist', async () => {
      const SecureStore = require('expo-secure-store');
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);

      const result = await useSecurityStore.getState().checkHasPin(mockUserId);

      expect(result).toBe(false);
      expect(useSecurityStore.getState().hasPin).toBe(false);
    });
  });

  describe('setupPin', () => {
    it('should hash PIN and store it', async () => {
      const SecureStore = require('expo-secure-store');
      const ExpoCrypto = require('expo-crypto');
      (ExpoCrypto.digestStringAsync as jest.Mock).mockResolvedValue(mockHashedPin);

      await useSecurityStore.getState().setupPin(mockUserId, mockPin);

      expect(ExpoCrypto.digestStringAsync).toHaveBeenCalled();
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
        `passandi_pin_hash_${mockUserId}`,
        mockHashedPin
      );
      expect(useSecurityStore.getState().hasPin).toBe(true);
    });
  });

  describe('verifyPin', () => {
    it('should return true when PIN matches', async () => {
      const SecureStore = require('expo-secure-store');
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(mockHashedPin);

      const result = await useSecurityStore.getState().verifyPin(mockUserId, mockPin);

      expect(result).toBe(true);
    });

    it('should return false when PIN does not match', async () => {
      const SecureStore = require('expo-secure-store');
      (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('different-hash');

      const result = await useSecurityStore.getState().verifyPin(mockUserId, mockPin);

      expect(result).toBe(false);
    });
  });

  describe('clearPin', () => {
    it('should delete PIN from secure store', async () => {
      const SecureStore = require('expo-secure-store');

      await useSecurityStore.getState().clearPin(mockUserId);

      expect(SecureStore.deleteItemAsync).toHaveBeenCalled();
      expect(useSecurityStore.getState().hasPin).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should reset error to null', () => {
      useSecurityStore.setState({ error: { id: 'err-1', message: 'Test error' } });

      useSecurityStore.getState().clearError();

      expect(useSecurityStore.getState().error).toBeNull();
    });
  });
});
