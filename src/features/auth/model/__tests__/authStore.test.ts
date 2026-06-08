const { useAuthStore } = require('../authStore');

const mockSession = {
  access_token: 'test-token',
  token_type: 'bearer',
  expires_in: 3600,
  refresh_token: 'refresh-token',
  user: {
    id: 'user-123',
    email: 'test@example.com',
    user_metadata: { full_name: 'Test User' },
    aud: 'authenticated',
    created_at: '2024-01-01',
  },
};

jest.mock('@/shared/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(() =>
        Promise.resolve({ data: { session: null }, error: null })
      ),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(() => Promise.resolve({ error: null })),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    })),
    rpc: jest.fn(),
  },
}));

jest.mock('../securityStore', () => ({
  useSecurityStore: {
    getState: jest.fn(() => ({
      clearPin: jest.fn(() => Promise.resolve()),
    })),
  },
}));

beforeEach(() => {
  jest.clearAllMocks();

  // Reset mocks
  const { supabase } = require('@/shared/lib/supabase');
  supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
  supabase.auth.signInWithPassword.mockResolvedValue({ error: null });
  supabase.auth.signUp.mockResolvedValue({ error: null });
  supabase.auth.signOut.mockResolvedValue({ error: null });

  useAuthStore.setState({
    session: null,
    user: null,
    loading: false,
    initialized: false,
  });
});

describe('useAuthStore', () => {
  describe('initial state', () => {
    it('should start with null session', () => {
      expect(useAuthStore.getState().session).toBeNull();
    });

    it('should start with null user', () => {
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('should start with loading false', () => {
      expect(useAuthStore.getState().loading).toBe(false);
    });

    it('should start with initialized false', () => {
      expect(useAuthStore.getState().initialized).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should set initialized to true after loading session', async () => {
      const { supabase } = require('@/shared/lib/supabase');

      await useAuthStore.getState().initialize();

      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(useAuthStore.getState().initialized).toBe(true);
    });

    it('should set user from session', async () => {
      const { supabase } = require('@/shared/lib/supabase');
      supabase.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      await useAuthStore.getState().initialize();

      expect(useAuthStore.getState().user?.email).toBe('test@example.com');
      expect(useAuthStore.getState().session).toEqual(mockSession);
    });
  });

  describe('signInEmail', () => {
    it('should sign in with email and password successfully', async () => {
      const { supabase } = require('@/shared/lib/supabase');
      supabase.auth.signInWithPassword.mockResolvedValue({ error: null });

      const result = await useAuthStore.getState().signInEmail('test@example.com', 'password123');

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should return error on failed sign in', async () => {
      const { supabase } = require('@/shared/lib/supabase');
      supabase.auth.signInWithPassword.mockResolvedValue({
        error: { message: 'Invalid login credentials' },
      });

      const result = await useAuthStore.getState().signInEmail('test@example.com', 'wrong');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toBe('Invalid login credentials');
      }
    });
  });

  describe('signUpEmail', () => {
    it('should sign up with email, password, and name', async () => {
      const { supabase } = require('@/shared/lib/supabase');
      supabase.auth.signUp.mockResolvedValue({ error: null });

      const result = await useAuthStore.getState().signUpEmail(
        'newuser@example.com',
        'securePass123',
        'New User'
      );

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'securePass123',
        options: { data: { full_name: 'New User' } },
      });
      expect(result.success).toBe(true);
    });
  });

  describe('signOut', () => {
    it('should clear session and user on sign out', async () => {
      useAuthStore.setState({ session: mockSession, user: mockSession.user });

      await useAuthStore.getState().signOut();

      expect(useAuthStore.getState().session).toBeNull();
      expect(useAuthStore.getState().user).toBeNull();
    });

    it('should call supabase signOut', async () => {
      const { supabase } = require('@/shared/lib/supabase');

      await useAuthStore.getState().signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('wipeData', () => {
    it('should sign out when wipeData is called', async () => {
      useAuthStore.setState({ session: mockSession, user: mockSession.user });
      const { supabase } = require('@/shared/lib/supabase');

      await useAuthStore.getState().wipeData();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(useAuthStore.getState().session).toBeNull();
      expect(useAuthStore.getState().user).toBeNull();
    });
  });

  describe('deleteAccount', () => {
    it('should delete vault data and sign out', async () => {
      useAuthStore.setState({ session: mockSession, user: mockSession.user });
      const { supabase } = require('@/shared/lib/supabase');

      await useAuthStore.getState().deleteAccount();

      expect(supabase.from).toHaveBeenCalledWith('vault_items');
      expect(supabase.rpc).toHaveBeenCalledWith('delete_user');
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });
});
