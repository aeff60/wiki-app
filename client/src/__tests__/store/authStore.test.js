import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useAuthStore } from '../../store/authStore.js';

const reset = () => act(() => useAuthStore.getState().clearAuth());

describe('authStore', () => {
  beforeEach(reset);

  it('initialises with no user or token', () => {
    const { user, token } = useAuthStore.getState();
    expect(user).toBeNull();
    expect(token).toBeNull();
  });

  it('setAuth stores user and token', () => {
    const user = { id: '1', email: 'test@test.com', role: 'viewer' };
    act(() => useAuthStore.getState().setAuth(user, 'tok123'));

    const state = useAuthStore.getState();
    expect(state.user).toEqual(user);
    expect(state.token).toBe('tok123');
  });

  it('setUser updates only the user', () => {
    act(() => useAuthStore.getState().setAuth({ id: '1', role: 'viewer' }, 'tok'));
    act(() => useAuthStore.getState().setUser({ id: '1', role: 'admin' }));

    const state = useAuthStore.getState();
    expect(state.user.role).toBe('admin');
    expect(state.token).toBe('tok');
  });

  it('clearAuth resets user and token to null', () => {
    act(() => useAuthStore.getState().setAuth({ id: '1' }, 'tok'));
    act(() => useAuthStore.getState().clearAuth());

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('isAuthenticated is true when token is set', () => {
    act(() => useAuthStore.getState().setAuth({ id: '1', role: 'viewer' }, 'tok'));
    expect(!!useAuthStore.getState().token).toBe(true);
  });
});
