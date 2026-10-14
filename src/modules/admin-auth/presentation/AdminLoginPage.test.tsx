import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminLoginPage } from './AdminLoginPage';

describe('AdminLoginPage Component', () => {
  const defaultProps = {
    isUnauthorized: false,
    isSigningIn: false,
    onSignInWithGoogle: vi.fn(),
    onSignOut: vi.fn(),
  };

  it('renders Google sign in button and lock icon when unauthenticated', () => {
    render(<AdminLoginPage {...defaultProps} />);

    expect(screen.getByTestId('admin-login-container')).toBeInTheDocument();
    expect(screen.getByTestId('admin-lock-icon')).toBeInTheDocument();
    expect(screen.getByTestId('admin-google-signin-btn')).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión con Google')).toBeInTheDocument();
  });

  it('triggers onSignInWithGoogle callback on button click', () => {
    const onSignIn = vi.fn();
    render(<AdminLoginPage {...defaultProps} onSignInWithGoogle={onSignIn} />);

    fireEvent.click(screen.getByTestId('admin-google-signin-btn'));
    expect(onSignIn).toHaveBeenCalledTimes(1);
  });

  it('displays loading state while sign in is in progress', () => {
    render(<AdminLoginPage {...defaultProps} isSigningIn={true} />);

    const button = screen.getByTestId('admin-google-signin-btn');
    expect(button).toBeDisabled();
    expect(screen.getByText('Conectando con Google...')).toBeInTheDocument();
  });

  it('displays actionError banner when provided', () => {
    render(
      <AdminLoginPage
        {...defaultProps}
        actionError="Popup closed by user during authentication"
      />
    );

    const errorBanner = screen.getByTestId('admin-action-error');
    expect(errorBanner).toBeInTheDocument();
    expect(errorBanner).toHaveTextContent('Popup closed by user during authentication');
  });

  it('renders unauthorized view when isUnauthorized is true', () => {
    const onSignOut = vi.fn();
    render(
      <AdminLoginPage
        {...defaultProps}
        isUnauthorized={true}
        attemptedEmail="guest@example.com"
        unauthorizedReason="Not on allowlist"
        onSignOut={onSignOut}
      />
    );

    expect(screen.getByTestId('admin-unauthorized-view')).toBeInTheDocument();
    expect(screen.getByTestId('admin-shield-alert-icon')).toBeInTheDocument();
    expect(screen.getByTestId('admin-attempted-email')).toHaveTextContent('guest@example.com');
    expect(screen.getByText('Not on allowlist')).toBeInTheDocument();

    const switchBtn = screen.getByTestId('admin-switch-account-btn');
    expect(switchBtn).toBeInTheDocument();
    fireEvent.click(switchBtn);
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
