import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CatalogHeader } from './CatalogHeader.tsx';

describe('CatalogHeader Component', () => {
  it('renders header elements and responds to user interactions', () => {
    const handleSearchFocus = vi.fn();
    const handleOpenArchitecture = vi.fn();

    // Create a mock DOM element for #revistas
    const scrollMock = vi.fn();
    const mockRevistas = document.createElement('div');
    mockRevistas.id = 'revistas';
    mockRevistas.scrollIntoView = scrollMock;
    document.body.appendChild(mockRevistas);

    render(
      <CatalogHeader
        onSearchFocus={handleSearchFocus}
        onOpenArchitecture={handleOpenArchitecture}
        totalArticles={142}
      />
    );

    expect(screen.getByText('Archivia')).toBeInTheDocument();
    expect(screen.getByText('Viaggi')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();

    // Click "Buscar Temática"
    const searchNavLink = screen.getByText('Buscar Temática');
    fireEvent.click(searchNavLink);
    expect(handleSearchFocus).toHaveBeenCalledTimes(1);

    // Click "Hemeroteca de Revistas"
    const hemerotecaLink = screen.getByText('Hemeroteca de Revistas');
    fireEvent.click(hemerotecaLink);
    expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' });

    // Click "Arquitectura DDD"
    const archButton = screen.getByRole('button', { name: /arquitectura ddd/i });
    fireEvent.click(archButton);
    expect(handleOpenArchitecture).toHaveBeenCalledTimes(1);

    // Click "Explorar Archivo" button
    const exploreButton = screen.getByRole('button', { name: /explorar archivo/i });
    fireEvent.click(exploreButton);
    expect(handleSearchFocus).toHaveBeenCalledTimes(2);

    document.body.removeChild(mockRevistas);
  });

  it('handles Hemeroteca link click when #revistas element does not exist in DOM', () => {
    render(
      <CatalogHeader
        onSearchFocus={vi.fn()}
        onOpenArchitecture={vi.fn()}
        totalArticles={10}
      />
    );

    const hemerotecaLink = screen.getByText('Hemeroteca de Revistas');
    expect(() => fireEvent.click(hemerotecaLink)).not.toThrow();
  });
});
