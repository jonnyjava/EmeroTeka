import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdminDashboard } from './AdminDashboard';
import { AdminUser } from '@/src/modules/admin-auth/domain/AdminUser';

vi.mock('./MagazineManagementSection', () => ({
  MagazineManagementSection: () => <div data-testid="mock-magazines-section">Mock Magazines Section</div>,
}));

vi.mock('./ArticleManagementSection', () => ({
  ArticleManagementSection: () => <div data-testid="mock-articles-section">Mock Articles Section</div>,
}));

describe('AdminDashboard Component', () => {
  const mockUser: AdminUser = {
    uid: 'admin_test_1',
    email: 'jonnyjava.net@gmail.com',
    displayName: 'Jonny Admin',
    photoURL: null,
  };

  it('renders top bar with authorized badge and admin email', () => {
    render(<AdminDashboard user={mockUser} onSignOut={vi.fn()} />);

    expect(screen.getByTestId('admin-dashboard-container')).toBeInTheDocument();
    expect(screen.getByTestId('admin-top-bar')).toBeInTheDocument();
    expect(screen.getByTestId('admin-authorized-badge')).toHaveTextContent('Autorizado');
    expect(screen.getByTestId('admin-user-email')).toHaveTextContent('jonnyjava.net@gmail.com');
  });

  it('renders navigation tabs and defaults to Magazines tab', () => {
    render(<AdminDashboard user={mockUser} onSignOut={vi.fn()} />);

    expect(screen.getByTestId('admin-tab-magazines')).toBeInTheDocument();
    expect(screen.getByTestId('admin-tab-articles')).toBeInTheDocument();
    expect(screen.getByTestId('mock-magazines-section')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-articles-section')).not.toBeInTheDocument();
  });

  it('switches between tabs when clicked', () => {
    render(<AdminDashboard user={mockUser} onSignOut={vi.fn()} />);

    fireEvent.click(screen.getByTestId('admin-tab-articles'));
    expect(screen.getByTestId('mock-articles-section')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-magazines-section')).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId('admin-tab-magazines'));
    expect(screen.getByTestId('mock-magazines-section')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-articles-section')).not.toBeInTheDocument();
  });

  it('triggers onSignOut callback when clicking sign out button', () => {
    const onSignOut = vi.fn();
    render(<AdminDashboard user={mockUser} onSignOut={onSignOut} />);

    fireEvent.click(screen.getByTestId('admin-signout-btn'));
    expect(onSignOut).toHaveBeenCalledTimes(1);
  });
});
