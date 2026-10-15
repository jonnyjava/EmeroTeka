import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { ArticleManagementSection } from './ArticleManagementSection';
import * as adminActions from '@/app/actions/admin';
import { ArticleAdminDTO, MagazineIssueOptionDTO } from '../domain/ArticleAdminEntity';
import { MagazineAdminDTO } from '../domain/MagazineAdminEntity';

vi.mock('@/app/actions/admin', () => ({
  getAdminArticlesAction: vi.fn(),
  getAdminMagazinesAction: vi.fn(),
  getAdminIssueOptionsAction: vi.fn(),
  createAdminArticleAction: vi.fn(),
  updateAdminArticleAction: vi.fn(),
  deleteAdminArticleAction: vi.fn(),
}));

describe('ArticleManagementSection Component', () => {
  const mockMagazines: MagazineAdminDTO[] = [
    { id: 1, name: 'National Geographic' },
    { id: 2, name: 'Condé Nast Traveler' },
  ];

  const mockIssues: MagazineIssueOptionDTO[] = [
    {
      id: 10,
      magazineId: 1,
      magazineName: 'National Geographic',
      issueNumber: '142',
      year: 2024,
      month: 'Mayo',
      label: 'National Geographic — Nº 142 (2024 - Mayo)',
    },
    {
      id: 20,
      magazineId: 2,
      magazineName: 'Condé Nast Traveler',
      issueNumber: '88',
      year: 2023,
      month: 'Octubre',
      label: 'Condé Nast Traveler — Nº 88 (2023 - Octubre)',
    },
  ];

  const mockArticles: ArticleAdminDTO[] = [
    {
      id: 100,
      magazineId: 1,
      magazineName: 'National Geographic',
      issueId: 10,
      issueNumber: '142',
      issueYear: 2024,
      issueMonth: 'Mayo',
      title: 'El Valle de los Reyes Oculto',
      subtitle: 'Nuevos túneles dinásticos',
      author: 'Howard Vance',
      startPage: 34,
      endPage: 52,
      synopsis: 'Exploración de las cámaras no cartografiadas de la tumba KV63.',
      tags: 'arqueologia, faraones',
      featured: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(adminActions.getAdminMagazinesAction).mockResolvedValue({
      success: true,
      data: mockMagazines,
    });
    vi.mocked(adminActions.getAdminIssueOptionsAction).mockResolvedValue({
      success: true,
      data: mockIssues,
    });
    vi.mocked(adminActions.getAdminArticlesAction).mockResolvedValue({
      success: true,
      data: mockArticles,
    });
  });

  it('renders articles list and header elements', async () => {
    render(<ArticleManagementSection />);

    expect(screen.getByTestId('article-management-section')).toBeInTheDocument();
    expect(screen.getByTestId('article-create-btn')).toBeInTheDocument();
    expect(screen.getByTestId('article-search-input')).toBeInTheDocument();
    expect(screen.getByTestId('article-filter-magazine')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('articles-table')).toBeInTheDocument();
      expect(screen.getByTestId('article-row-100')).toBeInTheDocument();
      expect(screen.getByText('El Valle de los Reyes Oculto')).toBeInTheDocument();
      expect(screen.getByTestId('article-featured-badge-100')).toBeInTheDocument();
    });
  });

  it('opens create modal when clicking "Nuevo Artículo"', async () => {
    render(<ArticleManagementSection />);

    await waitFor(() => {
      expect(screen.getByTestId('articles-table')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('article-create-btn'));

    expect(screen.getByTestId('article-form-modal')).toBeInTheDocument();
    expect(screen.getByTestId('article-form-title')).toBeInTheDocument();
    expect(screen.getByTestId('article-submit-btn')).toHaveTextContent('Crear Artículo');
  });

  it('submits create form and calls createAdminArticleAction', async () => {
    vi.mocked(adminActions.createAdminArticleAction).mockResolvedValueOnce({
      success: true,
      data: { id: 101, title: 'Ruta por la Selva Negra' } as unknown as ArticleAdminDTO,
    });

    render(<ArticleManagementSection />);

    await waitFor(() => {
      expect(screen.getByTestId('articles-table')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('article-create-btn'));

    fireEvent.change(screen.getByTestId('article-form-title'), {
      target: { value: 'Ruta por la Selva Negra' },
    });
    fireEvent.change(screen.getByTestId('article-form-synopsis'), {
      target: { value: 'Una guía detallada de senderos ancestrales y molinos históricos.' },
    });

    fireEvent.click(screen.getByTestId('article-submit-btn'));

    await waitFor(() => {
      expect(adminActions.createAdminArticleAction).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Ruta por la Selva Negra',
        })
      );
    });
  });

  it('opens edit modal with prefilled data', async () => {
    render(<ArticleManagementSection />);

    await waitFor(() => {
      expect(screen.getByTestId('article-edit-btn-100')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('article-edit-btn-100'));

    expect(screen.getByTestId('article-form-modal')).toBeInTheDocument();
    const titleInput = screen.getByTestId('article-form-title') as HTMLInputElement;
    expect(titleInput.value).toBe('El Valle de los Reyes Oculto');
    expect(screen.getByTestId('article-submit-btn')).toHaveTextContent('Guardar Cambios');
  });

  it('opens delete confirmation dialog and triggers delete action', async () => {
    vi.mocked(adminActions.deleteAdminArticleAction).mockResolvedValueOnce({
      success: true,
      data: true,
    });

    render(<ArticleManagementSection />);

    await waitFor(() => {
      expect(screen.getByTestId('article-delete-btn-100')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('article-delete-btn-100'));

    expect(screen.getByTestId('article-delete-dialog')).toBeInTheDocument();
    expect(within(screen.getByTestId('article-delete-dialog')).getByText(/El Valle de los Reyes Oculto/)).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('article-confirm-delete-btn'));

    await waitFor(() => {
      expect(adminActions.deleteAdminArticleAction).toHaveBeenCalledWith(100);
    });
  });
});
