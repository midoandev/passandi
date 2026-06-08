const { useSettingsStore } = require('../settingsStore');

// Mock i18n
jest.mock('@/shared/lib/i18n', () => ({
  __esModule: true,
  default: {
    language: 'en',
    changeLanguage: jest.fn(),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
  useSettingsStore.setState({
    language: 'en',
  });
});

describe('useSettingsStore', () => {
  describe('initial state', () => {
    it('should have "en" as default language', () => {
      const { language } = useSettingsStore.getState();
      expect(language).toBe('en');
    });
  });

  describe('setLanguage', () => {
    it('should update language', () => {
      useSettingsStore.getState().setLanguage('id');

      const { language } = useSettingsStore.getState();
      expect(language).toBe('id');
    });

    it('should switch back to English', () => {
      useSettingsStore.getState().setLanguage('id');
      useSettingsStore.getState().setLanguage('en');

      const { language } = useSettingsStore.getState();
      expect(language).toBe('en');
    });

    it('should notify i18n of language change', () => {
      const i18n = require('@/shared/lib/i18n').default;
      const originalChangeLanguage = require('@/shared/lib/i18n').default.changeLanguage;

      useSettingsStore.getState().setLanguage('id');

      expect(originalChangeLanguage).toHaveBeenCalledWith('id');
    });
  });
});
