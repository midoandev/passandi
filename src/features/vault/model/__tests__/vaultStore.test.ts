const { useVaultUIStore } = require('../vaultStore');

const mockCategory = {
  id: 'cat-1',
  name: 'Test Category',
  icon: 'folder',
  color: '#FF0000',
};

beforeEach(() => {
  useVaultUIStore.setState({
    selectedCategory: null,
    searchQuery: '',
    isSearchVisible: false,
  });
});

describe('useVaultUIStore', () => {
  describe('initial state', () => {
    it('should have null selectedCategory', () => {
      const { selectedCategory } = useVaultUIStore.getState();
      expect(selectedCategory).toBeNull();
    });

    it('should have empty searchQuery', () => {
      const { searchQuery } = useVaultUIStore.getState();
      expect(searchQuery).toBe('');
    });

    it('should have isSearchVisible as false', () => {
      const { isSearchVisible } = useVaultUIStore.getState();
      expect(isSearchVisible).toBe(false);
    });
  });

  describe('setCategory', () => {
    it('should set selected category', () => {
      useVaultUIStore.getState().setCategory(mockCategory);

      const { selectedCategory } = useVaultUIStore.getState();
      expect(selectedCategory).toEqual(mockCategory);
    });

    it('should override previous category', () => {
      const newCategory = {
        id: 'cat-2',
        name: 'Updated Category',
        icon: 'star',
        color: '#0000FF',
      };

      useVaultUIStore.getState().setCategory(mockCategory);
      useVaultUIStore.getState().setCategory(newCategory);

      const { selectedCategory } = useVaultUIStore.getState();
      expect(selectedCategory).toEqual(newCategory);
      expect(selectedCategory!.name).toBe('Updated Category');
    });
  });

  describe('setSearchQuery', () => {
    it('should set search query', () => {
      useVaultUIStore.getState().setSearchQuery('test search');

      const { searchQuery } = useVaultUIStore.getState();
      expect(searchQuery).toBe('test search');
    });

    it('should clear search query with empty string', () => {
      useVaultUIStore.getState().setSearchQuery('something');
      useVaultUIStore.getState().setSearchQuery('');

      const { searchQuery } = useVaultUIStore.getState();
      expect(searchQuery).toBe('');
    });
  });

  describe('toggleSearch', () => {
    it('should toggle search visibility from false to true', () => {
      useVaultUIStore.getState().toggleSearch();

      const { isSearchVisible } = useVaultUIStore.getState();
      expect(isSearchVisible).toBe(true);
    });

    it('should toggle search visibility from true to false', () => {
      useVaultUIStore.getState().toggleSearch();
      useVaultUIStore.getState().toggleSearch();

      const { isSearchVisible } = useVaultUIStore.getState();
      expect(isSearchVisible).toBe(false);
    });
  });
});
