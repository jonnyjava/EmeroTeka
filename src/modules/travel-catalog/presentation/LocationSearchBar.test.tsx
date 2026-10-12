import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocationSearchBar } from './LocationSearchBar.tsx';

describe('LocationSearchBar Component', () => {
  const sampleMagazines = [
    { id: 1, name: 'National Geographic', issuesCount: 10, articlesCount: 40 },
    { id: 2, name: 'Lonely Planet', issuesCount: 5, articlesCount: 20 },
  ];

  it('renders search bar, handles typing, clearing, and selection changes', () => {
    const handleQueryChange = vi.fn();
    const handleMagazineChange = vi.fn();
    const handleYearChange = vi.fn();
    const handleReset = vi.fn();
    const inputRef = React.createRef<HTMLInputElement>();

    render(
      <LocationSearchBar
        query="Petra"
        onQueryChange={handleQueryChange}
        selectedMagazineId={1}
        onMagazineChange={handleMagazineChange}
        selectedYear={2021}
        onYearChange={handleYearChange}
        magazines={sampleMagazines}
        popularTopics={['Petra · Jordania', 'Kioto · Japón']}
        totalResults={5}
        isLoading={false}
        onReset={handleReset}
        inputRef={inputRef}
      />
    );

    expect(screen.getByDisplayValue('Petra')).toBeInTheDocument();
    expect(screen.getByText('5 resultados')).toBeInTheDocument();
    const input = screen.getByDisplayValue('Petra');
    fireEvent.change(input, { target: { value: 'Nuevo' } });
    expect(handleQueryChange).toHaveBeenCalledWith('Nuevo');

    // Click clear button
    const clearBtn = screen.getByLabelText('Limpiar búsqueda');
    fireEvent.click(clearBtn);
    expect(handleQueryChange).toHaveBeenCalledWith('');

    // Change magazine select
    const magSelect = screen.getByLabelText('Revista');
    fireEvent.change(magSelect, { target: { value: '2' } });
    expect(handleMagazineChange).toHaveBeenCalledWith(2);

    fireEvent.change(magSelect, { target: { value: '' } });
    expect(handleMagazineChange).toHaveBeenCalledWith(undefined);

    // Change year select
    const yearSelect = screen.getByLabelText('Año');
    fireEvent.change(yearSelect, { target: { value: '2020' } });
    expect(handleYearChange).toHaveBeenCalledWith(2020);

    fireEvent.change(yearSelect, { target: { value: '' } });
    expect(handleYearChange).toHaveBeenCalledWith(undefined);

    // Click quick topic
    const topicBtn = screen.getByRole('button', { name: 'Kioto · Japón' });
    fireEvent.click(topicBtn);
    expect(handleQueryChange).toHaveBeenCalledWith('Kioto · Japón');

    // Click reset button
    const resetBtn = screen.getByRole('button', { name: /restablecer/i });
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('displays loading state indicator and handles popularDestinations fallback', () => {
    render(
      <LocationSearchBar
        query=""
        onQueryChange={vi.fn()}
        onMagazineChange={vi.fn()}
        onYearChange={vi.fn()}
        magazines={[]}
        popularDestinations={['Cusco · Perú']}
        totalResults={0}
        isLoading={true}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByText('...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cusco · Perú' })).toBeInTheDocument();
    expect(screen.queryByText('Restablecer')).not.toBeInTheDocument();
  });

  it('handles empty fallback when neither popularTopics nor popularDestinations are provided', () => {
    render(
      <LocationSearchBar
        query=""
        onQueryChange={vi.fn()}
        onMagazineChange={vi.fn()}
        onYearChange={vi.fn()}
        magazines={[]}
        totalResults={0}
        isLoading={false}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByText('0 resultados')).toBeInTheDocument();
  });

  it('highlights topic button when query matches topic name', () => {
    render(
      <LocationSearchBar
        query="Cusco · Perú"
        onQueryChange={vi.fn()}
        onMagazineChange={vi.fn()}
        onYearChange={vi.fn()}
        magazines={[]}
        popularTopics={['Cusco · Perú', 'Roma · Italia']}
        totalResults={1}
        isLoading={false}
        onReset={vi.fn()}
      />
    );

    const activeBtn = screen.getByRole('button', { name: 'Cusco · Perú' });
    expect(activeBtn).toHaveClass('bg-[#2A3E92]');
  });
});
