import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AdminRouteGuard } from './AdminRouteGuard';
import * as useAdminAuthModule from './useAdminAuth';

vi.mock('./useAdminAuth');

describe('AdminRouteGuard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading indicator when auth state is loading', () => {
    vi.spyOn(useAdminAuthModule, 'useAdminAuth').mockReturnValue({
      authState: { status: 'loading' },
      isSigningIn: false,
      actionError: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    render(<AdminRouteGuard />);
    expect(screen.getByTestId('admin-loading-screen')).toBeInTheDocument();
    expect(screen.getByText('Verificando credenciales...')).toBeInTheDocument();
  });

  it('renders AdminLoginPage when unauthenticated', () => {
    vi.spyOn(useAdminAuthModule, 'useAdminAuth').mockReturnValue({
      authState: { status: 'unauthenticated' },
      isSigningIn: false,
      actionError: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    render(<AdminRouteGuard />);
    expect(screen.getByTestId('admin-login-container')).toBeInTheDocument();
    expect(screen.getByTestId('admin-google-signin-btn')).toBeInTheDocument();
  });

  it('renders unauthorized view when signed in with unauthorized email', () => {
    vi.spyOn(useAdminAuthModule, 'useAdminAuth').mockReturnValue({
      authState: {
        status: 'unauthorized',
        attemptedEmail: 'other@gmail.com',
        reason: 'Account not allowed',
      },
      isSigningIn: false,
      actionError: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    render(<AdminRouteGuard />);
    expect(screen.getByTestId('admin-unauthorized-view')).toBeInTheDocument();
    expect(screen.getByTestId('admin-attempted-email')).toHaveTextContent('other@gmail.com');
  });

  it('renders AdminDashboard when authorized with jonnyjava.net@gmail.com', () => {
    vi.spyOn(useAdminAuthModule, 'useAdminAuth').mockReturnValue({
      authState: {
        status: 'authorized',
        user: {
          uid: 'admin_1',
          email: 'jonnyjava.net@gmail.com',
          displayName: 'Jonny',
          photoURL: null,
        },
      },
      isSigningIn: false,
      actionError: null,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });

    render(<AdminRouteGuard />);
    expect(screen.getByTestId('admin-dashboard-container')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-magazines')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-articles')).toBeInTheDocument();
    expect(screen.getByTestId('admin-user-email')).toHaveTextContent('jonnyjava.net@gmail.com');
  });
});
