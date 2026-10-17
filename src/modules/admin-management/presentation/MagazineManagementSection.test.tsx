import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MagazineManagementSection } from './MagazineManagementSection';
import * as adminActions from '@/app/actions/admin';
import { MagazineAdminDTO } from '../domain/MagazineAdminEntity';

vi.mock('@/app/actions/admin', () => ({
  getAdminMagazinesAction: vi.fn(),
  createAdminMagazineAction: vi.fn(),
  updateAdminMagazineAction: vi.fn(),
  deleteAdminMagazineAction: vi.fn(),
}));

describe('MagazineManagementSection Component', () => {
  const mockMagazines: MagazineAdminDTO[] = [
    {
      id: 1,
      name: 'National Geographic',
      publisher: 'National Geographic Society',
      country: 'Estados Unidos',
      issuesCount: 5,
      articlesCount: 12,
    },
    {
      id: 2,
      name: 'Altaïr',
      publisher: 'Altaïr Viatges',
      country: 'España',
      issuesCount: 3,
      articlesCount: 8,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminActions.getAdminMagazinesAction).mockResolvedValue({
      success: true,
      data: mockMagazines,
    });
  });

  it('renders magazines list and header elements', async () => {
    render(<MagazineManagementSection />);

    expect(screen.getByTestId('magazine-management-section')).toBeInTheDocument();
    expect(screen.getByTestId('magazine-create-btn')).toBeInTheDocument();
    expect(screen.getByTestId('magazine-search-input')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('magazines-table')).toBeInTheDocument();
      expect(screen.getByTestId('magazine-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('magazine-row-2')).toBeInTheDocument();
      expect(screen.getByText('National Geographic')).toBeInTheDocument();
      expect(screen.getByText('Altaïr')).toBeInTheDocument();
    });
  });

  it('opens create modal when clicking "Nueva Revista" button', async () => {
    render(<MagazineManagementSection />);

    await waitFor(() => {
      expect(screen.getByTestId('magazines-table')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('magazine-create-btn'));

    expect(screen.getByTestId('magazine-form-modal')).toBeInTheDocument();
    expect(screen.getByTestId('magazine-form-name')).toBeInTheDocument();
    expect(screen.getByTestId('magazine-submit-btn')).toHaveTextContent('Crear Revista');
  });

  it('submits create form and calls createAdminMagazineAction', async () => {
    vi.mocked(adminActions.createAdminMagazineAction).mockResolvedValueOnce({
      success: true,
      data: { id: 3, name: 'Geo Magazine' },
    });

    render(<MagazineManagementSection />);

    await waitFor(() => {
      expect(screen.getByTestId('magazines-table')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('magazine-create-btn'));

    fireEvent.change(screen.getByTestId('magazine-form-name'), {
      target: { value: 'Geo Magazine' },
    });
    fireEvent.change(screen.getByTestId('magazine-form-publisher'), {
      target: { value: 'Gruner + Jahr' },
    });
    fireEvent.change(screen.getByTestId('magazine-form-country'), {
      target: { value: 'Alemania' },
    });

    fireEvent.click(screen.getByTestId('magazine-submit-btn'));

    await waitFor(() => {
      expect(adminActions.createAdminMagazineAction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Geo Magazine',
          publisher: 'Gruner + Jahr',
          country: 'Alemania',
        })
      );
    });
  });

  it('opens edit modal with prefilled data', async () => {
    render(<MagazineManagementSection />);

    await waitFor(() => {
      expect(screen.getByTestId('magazine-edit-btn-1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('magazine-edit-btn-1'));

    expect(screen.getByTestId('magazine-form-modal')).toBeInTheDocument();
    const nameInput = screen.getByTestId('magazine-form-name') as HTMLInputElement;
    expect(nameInput.value).toBe('National Geographic');
    expect(screen.getByTestId('magazine-submit-btn')).toHaveTextContent('Guardar Cambios');
  });

  it('opens delete confirmation dialog and triggers delete action', async () => {
    vi.mocked(adminActions.deleteAdminMagazineAction).mockResolvedValueOnce({
      success: true,
      data: true,
    });

    render(<MagazineManagementSection />);

    await waitFor(() => {
      expect(screen.getByTestId('magazine-delete-btn-2')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('magazine-delete-btn-2'));

    expect(screen.getByTestId('magazine-delete-dialog')).toBeInTheDocument();
    expect(within(screen.getByTestId('magazine-delete-dialog')).getByText(/Altaïr/)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('magazine-confirm-delete-btn'));

    await waitFor(() => {
      expect(adminActions.deleteAdminMagazineAction).toHaveBeenCalledWith(2);
    });
  });
});
