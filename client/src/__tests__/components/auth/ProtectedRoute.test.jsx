import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute.jsx';
import { useAuthStore } from '../../../store/authStore.js';

const reset = () => act(() => useAuthStore.getState().clearAuth());

function renderInRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe('ProtectedRoute', () => {
  beforeEach(reset);

  it('does not render children when the user is not authenticated', () => {
    renderInRouter(
      <ProtectedRoute>
        <div>protected content</div>
      </ProtectedRoute>,
    );
    expect(screen.queryByText('protected content')).toBeNull();
  });

  it('renders children when authenticated and no minRole is required', () => {
    act(() => useAuthStore.getState().setAuth({ id: '1', role: 'viewer' }, 'tok'));

    renderInRouter(
      <ProtectedRoute>
        <div>protected content</div>
      </ProtectedRoute>,
    );
    expect(screen.getByText('protected content')).toBeDefined();
  });

  it('does not render children when the user role is below minRole', () => {
    act(() => useAuthStore.getState().setAuth({ id: '1', role: 'viewer' }, 'tok'));

    renderInRouter(
      <ProtectedRoute minRole="admin">
        <div>admin only</div>
      </ProtectedRoute>,
    );
    expect(screen.queryByText('admin only')).toBeNull();
  });

  it('renders children when the user role meets minRole', () => {
    act(() => useAuthStore.getState().setAuth({ id: '1', role: 'admin' }, 'tok'));

    renderInRouter(
      <ProtectedRoute minRole="editor">
        <div>editor content</div>
      </ProtectedRoute>,
    );
    expect(screen.getByText('editor content')).toBeDefined();
  });

  it('renders children when the user role exactly matches minRole', () => {
    act(() => useAuthStore.getState().setAuth({ id: '1', role: 'editor' }, 'tok'));

    renderInRouter(
      <ProtectedRoute minRole="editor">
        <div>editor content</div>
      </ProtectedRoute>,
    );
    expect(screen.getByText('editor content')).toBeDefined();
  });
});
