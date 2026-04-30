import { useAuthStore } from '../store/authStore.js';

export function useAuth() {
  const { user, token, setAuth, clearAuth } = useAuthStore();
  return { user, token, isAuthenticated: !!token, setAuth, clearAuth };
}
