import { useAuthStore } from '../store/authStore.js';

const ROLE_LEVEL = { viewer: 1, editor: 2, admin: 3 };

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const level = ROLE_LEVEL[user?.role] ?? 0;
  return {
    isAdmin: level >= 3,
    isEditor: level >= 2,
    isViewer: level >= 1,
    can: (minRole) => level >= (ROLE_LEVEL[minRole] ?? 99),
  };
}
