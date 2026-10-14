import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminBlankCanvas } from './AdminBlankCanvas';
import { AdminUser } from '../domain/AdminUser';

describe('AdminBlankCanvas Component', () => {
  const mockUser: AdminUser = {
    uid: 'admin_123',
    email: 'jonnyjava.net@gmail.com',
    displayName: 'Jonny Java',
    photoURL: null,
  };

  it('renders authorized admin header with user email and authorized badge', () => {
    render(<AdminBlankCanvas user={mockUser} onSignOut={vi.fn()} />);

    expect(screen.getByTestId('admin-dashboard-container')).toBeInTheDocument();
    expect(screen.getByTestId('admin-top-bar')).toBeInTheDocument();
    expect(screen.getByTestId('admin-authorized-badge')).toHaveTextContent('Autorizado');
    expect(screen.getByTestId('admin-user-email')).toHaveTextContent('jonnyjava.net@gmail.com');
  });

  it('renders blank canvas workspace area', () => {
    render(<AdminBlankCanvas user={mockUser} onSignOut={vi.fn()} />);

    expect(screen.getByTestId('admin-blank-canvas')).toBeInTheDocument();
    expect(screen.getByText('Área de Gestión')).toBeInTheDocument();
  });

  it('calls onSignOut when sign out button is clicked', () => {
    const onSignOut = vi.fn();
    render(<AdminBlankCanvas user={mockUser} onSignOut={onSignOut} />);

    const signOutBtn = screen.getByTestId('admin-signout-btn');
    expect(signOutBtn).toBeInTheDocument();
    fireEvent.click(signOutBtn);
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
