import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      employee: null,
      apps: [],
      loginTime: null,

      login: (payload) => {
        set({
          isLoggedIn: true,
          user: payload.user,
          employee: payload.employee,
          apps: payload.apps,
          loginTime: Date.now(),
        });
      },

      logout: () => {
        // Clear localStorage explicitly
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('user');
        localStorage.removeItem('employee');
        set({
          isLoggedIn: false,
          user: null,
          employee: null,
          apps: [],
          loginTime: null,
        });
      },
    }),
    {
      name: 'auth-storage', // Storage key name
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        employee: state.employee,
        apps: state.apps,
        loginTime: state.loginTime,
      }),
    },
  ),
);

export default useAuthStore;
