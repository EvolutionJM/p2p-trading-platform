import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import socketService from '../services/socket';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('token', token);
          socketService.connect(token);
        } else {
          localStorage.removeItem('token');
          socketService.disconnect();
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(credentials);
          
          if (response.requires2FA) {
            set({ isLoading: false });
            return { requires2FA: true, tempToken: response.tempToken };
          }

          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('token', response.token);
          socketService.connect(response.token);

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(userData);
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
          });

          localStorage.setItem('token', response.token);
          socketService.connect(response.token);

          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          socketService.disconnect();
        }
      },

      fetchUser: async () => {
        const token = get().token || localStorage.getItem('token');
        if (!token) return;

        try {
          const response = await authAPI.getMe();
          set({ user: response.user, isAuthenticated: true });
          socketService.connect(token);
        } catch (error) {
          console.error('Fetch user error:', error);
          get().logout();
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
