import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ArticleDetailModal } from './ArticleDetailModal.tsx';
import { ArticleDTO } from '../domain/Article.ts';

describe('ArticleDetailModal Component', () => {
  const sampleArticle: ArticleDTO = {
    id: 42,
    title: 'Petra Entre Sombras y Rocas',
    subtitle: 'Arqueología nabatea en el Siq',
    author: 'Johann Burckhardt',
    photographer: 'David Roberts',
    startPage: 18,
    endPage: 34,
    pageCount: 17,
    pageCitation: 'pp. 18–34',
    city: 'Petra',
    region: 'Ma\'an',
    country: 'Jordania',
    location: 'Petra · Jordania',
    magazine: {
      id: 2,
      name: 'Altaïr Magazine',
      issueNumber: '112',
      year: 2020,
      month: 'Abril',
      fullCitation: 'Altaïr Magazine · Nº 112 (Abril 2020)',
    },
    synopsis: 'Exploración arqueológica y etnográfica en el cañón de Petra.',
    tags: ['Arqueología', 'Jordania', 'Nabateos'],
    featured: true,
    coverImageUrl: 'https://images.unsplash.com/petra.jpg',
    catalogReference: 'Altaïr Magazine · Nº 112 (Abril 2020) · pp. 18–34',
  };

  it('renders nothing when article is null', () => {
    const { container } = render(<ArticleDetailModal article={null} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders full article details, location, pagination, and credits', () => {
    const handleClose = vi.fn();
    render(<ArticleDetailModal article={sampleArticle} onClose={handleClose} />);

    expect(screen.getByText('Petra Entre Sombras y Rocas')).toBeInTheDocument();
    expect(screen.getByText('Arqueología nabatea en el Siq')).toBeInTheDocument();
    expect(screen.getByText('Ref. #42')).toBeInTheDocument();
    expect(screen.getByText('Petra · Jordania')).toBeInTheDocument();
    expect(screen.getAllByText(/Johann Burckhardt/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/David Roberts/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Páginas 18 a 34 (17 páginas)')).toBeInTheDocument();
    expect(screen.getByText('Nabateos')).toBeInTheDocument();

    // Close button in header
    const closeBtn = screen.getByLabelText('Cerrar ficha');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Close button in footer
    const footerCloseBtn = screen.getByRole('button', { name: 'Cerrar' });
    fireEvent.click(footerCloseBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('copies bibliographic citation to clipboard and shows feedback', async () => {
    vi.useFakeTimers();

    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(<ArticleDetailModal article={sampleArticle} onClose={vi.fn()} />);

    const copyBtn = screen.getByRole('button', { name: /copiar cita/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith(
      expect.stringContaining('Petra Entre Sombras y Rocas')
    );
    expect(screen.getByText('¡Copiado!')).toBeInTheDocument();

    // Advance timer to test reverting copied state
    act(() => {
      vi.advanceTimersByTime(2300);
    });

    expect(screen.queryByText('¡Copiado!')).not.toBeInTheDocument();
    expect(screen.getByText('Copiar Cita')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('handles backdrop click to close and prevents modal content click propagation', () => {
    const handleClose = vi.fn();
    render(<ArticleDetailModal article={sampleArticle} onClose={handleClose} />);

    // Click backdrop
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Click content does not close
    const modalContent = screen.getByText('Ficha Bibliográfica del Catálogo');
    fireEvent.click(modalContent);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
