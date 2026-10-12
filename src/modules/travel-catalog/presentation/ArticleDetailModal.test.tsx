import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ArticleDetailModal } from './ArticleDetailModal.tsx';
import { ArticleDTO } from '../domain/Article.ts';

describe('ArticleDetailModal Component', () => {
  const sampleArticle: ArticleDTO = {
    id: 42,
    title: 'Ruta por los Glaciares',
    subtitle: 'Expedición en el sur de la Patagonia',
    author: 'Mateo Morales',
    photographer: 'Elena Rostova',
    startPage: 24,
    endPage: 38,
    pageCount: 15,
    pageCitation: 'pp. 24–38',
    topic: {
      name: 'El Calafate',
      category: 'Argentina',
      subtopic: 'Santa Cruz',
      formatted: 'El Calafate · Santa Cruz · Argentina',
    },
    magazine: {
      id: 5,
      name: 'Viajes National Geographic',
      issueNumber: '180',
      year: 2022,
      month: 'Diciembre',
      fullCitation: 'Viajes National Geographic · Nº 180 (Diciembre 2022)',
    },
    synopsis: 'Travesía por el glaciar Perito Moreno y senderos andinos.',
    tags: ['Glaciares', 'Patagonia', 'Aventura'],
    featured: true,
    catalogReference: 'Viajes National Geographic · Nº 180 (Diciembre 2022) · pp. 24–38',
  };

  beforeEach(() => {
    vi.useFakeTimers();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders null when article is null', () => {
    const { container } = render(
      <ArticleDetailModal article={null} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders article details and handles close clicks', () => {
    const handleClose = vi.fn();
    render(<ArticleDetailModal article={sampleArticle} onClose={handleClose} />);

    expect(screen.getByText('Ficha Bibliográfica del Catálogo')).toBeInTheDocument();
    expect(screen.getByText('Ruta por los Glaciares')).toBeInTheDocument();
    expect(screen.getByText('Expedición en el sur de la Patagonia')).toBeInTheDocument();
    expect(screen.getByText('Mateo Morales')).toBeInTheDocument();
    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();
    expect(screen.getByText('#Glaciares')).toBeInTheDocument();

    // Click backdrop
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Click top close icon
    const closeBtn = screen.getByLabelText('Cerrar ficha');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(2);

    // Click bottom "Cerrar Ficha" button
    const bottomCloseBtn = screen.getByRole('button', { name: 'Cerrar Ficha' });
    fireEvent.click(bottomCloseBtn);
    expect(handleClose).toHaveBeenCalledTimes(3);
  });

  it('copies citation to clipboard and shows feedback', async () => {
    render(<ArticleDetailModal article={sampleArticle} onClose={vi.fn()} />);

    const copyBtn = screen.getByRole('button', { name: /copiar cita/i });
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('Ruta por los Glaciares')
    );

    // Feedback should show "¡Copiado!"
    expect(screen.getByText('¡Copiado!')).toBeInTheDocument();

    // Advance timer to test reverting
    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.getByText('Copiar Cita')).toBeInTheDocument();
  });

  it('renders correctly without author, subtitle, or photographer', () => {
    const minimalArticle: ArticleDTO = {
      ...sampleArticle,
      author: undefined,
      subtitle: undefined,
      photographer: undefined,
    };

    render(<ArticleDetailModal article={minimalArticle} onClose={vi.fn()} />);

    expect(screen.getByText('Redacción editorial')).toBeInTheDocument();
    expect(screen.queryByText('Fotografía:')).not.toBeInTheDocument();
  });
});
