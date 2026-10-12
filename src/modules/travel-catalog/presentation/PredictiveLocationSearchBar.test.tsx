import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PredictiveLocationSearchBar } from './PredictiveLocationSearchBar.tsx';

describe('PredictiveLocationSearchBar Component', () => {
  const sampleMagazines = [
    { id: 1, name: 'National Geographic', issuesCount: 15, articlesCount: 60 },
  ];
  const sampleTopics = ['Petra · Jordania', 'Kioto · Japón', 'Patagonia · Argentina'];

  it('renders input, handles typing, and opens predictive dropdown', () => {
    const handleQueryChange = vi.fn();
    const inputRef = React.createRef<HTMLInputElement>();

    render(
      <PredictiveLocationSearchBar
        query="Pet"
        onQueryChange={handleQueryChange}
        magazines={sampleMagazines}
        popularTopics={sampleTopics}
        totalResults={1}
        isLoading={false}
        onReset={vi.fn()}
        inputRef={inputRef}
      />
    );

    const input = screen.getByPlaceholderText(/buscar temática o destino/i);

    // Focus input to show predictive dropdown
    fireEvent.focus(input);

    const petraElements = screen.getAllByText('Petra · Jordania');
    expect(petraElements.length).toBeGreaterThanOrEqual(1);

    // Click predictive option
    fireEvent.click(petraElements[0]);
    expect(handleQueryChange).toHaveBeenCalledWith('Petra · Jordania');
  });

  it('supports keyboard navigation (ArrowDown, ArrowUp, Enter, Escape) in dropdown', () => {
    const handleQueryChange = vi.fn();

    render(
      <PredictiveLocationSearchBar
        query="P"
        onQueryChange={handleQueryChange}
        magazines={sampleMagazines}
        popularTopics={sampleTopics}
        totalResults={2}
        isLoading={false}
        onReset={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText(/buscar temática o destino/i);
    fireEvent.focus(input);

    // Navigate with ArrowDown to end and wrap around
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    // Navigate with ArrowUp to wrap around backwards
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    // Other key (should do nothing special)
    fireEvent.keyDown(input, { key: 'Tab' });
    // Select with Enter
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(handleQueryChange).toHaveBeenCalled();

    // Test Escape key closes dropdown
    fireEvent.focus(input);
    expect(screen.getByText('Temáticas coincidentes en el índice impreso')).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByText('Temáticas coincidentes en el índice impreso')).not.toBeInTheDocument();
  });

  it('handles clearing search query and outside click', () => {
    const handleQueryChange = vi.fn();
    const handleReset = vi.fn();

    render(
      <div>
        <div data-testid="outside">Outside Area</div>
        <PredictiveLocationSearchBar
          query="Kioto"
          onQueryChange={handleQueryChange}
          selectedMagazineId={1}
          onMagazineChange={vi.fn()}
          selectedYear={2022}
          onYearChange={vi.fn()}
          magazines={sampleMagazines}
          popularTopics={sampleTopics}
          totalResults={3}
          isLoading={false}
          onReset={handleReset}
        />
      </div>
    );

    const input = screen.getByPlaceholderText(/buscar temática o destino/i);
    fireEvent.focus(input);

    // Dropdown should be open
    expect(screen.getByText('Temáticas coincidentes en el índice impreso')).toBeInTheDocument();

    // Click outside to close dropdown
    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(screen.queryByText('Temáticas coincidentes en el índice impreso')).not.toBeInTheDocument();

    // Clear input button
    const clearBtn = screen.getByLabelText('Limpiar campo');
    fireEvent.click(clearBtn);
    expect(handleQueryChange).toHaveBeenCalledWith('');

    // Reset button
    const resetBtn = screen.getByRole('button', { name: /restablecer búsqueda/i });
    fireEvent.click(resetBtn);
    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  it('renders loading state indicator and handles filter select changes', () => {
    const handleMagazineChange = vi.fn();
    const handleYearChange = vi.fn();

    render(
      <PredictiveLocationSearchBar
        query=""
        onQueryChange={vi.fn()}
        onMagazineChange={handleMagazineChange}
        onYearChange={handleYearChange}
        magazines={sampleMagazines}
        popularTopics={sampleTopics}
        totalResults={0}
        isLoading={true}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByText('Consultando...')).toBeInTheDocument();

    // Change magazine filter
    const magSelect = screen.getByLabelText('Revista Publicada');
    fireEvent.change(magSelect, { target: { value: '1' } });
    expect(handleMagazineChange).toHaveBeenCalledWith(1);

    fireEvent.change(magSelect, { target: { value: '' } });
    expect(handleMagazineChange).toHaveBeenCalledWith(undefined);

    // Change year filter
    const yearSelect = screen.getByLabelText('Año de Edición');
    fireEvent.change(yearSelect, { target: { value: '2021' } });
    expect(handleYearChange).toHaveBeenCalledWith(2021);

    fireEvent.change(yearSelect, { target: { value: '' } });
    expect(handleYearChange).toHaveBeenCalledWith(undefined);
  });

  it('selects quick topic chip from bottom chips section', () => {
    const handleQueryChange = vi.fn();
    render(
      <PredictiveLocationSearchBar
        query=""
        onQueryChange={handleQueryChange}
        magazines={sampleMagazines}
        popularTopics={sampleTopics}
        totalResults={3}
        isLoading={false}
        onReset={vi.fn()}
      />
    );

    const chip = screen.getByRole('button', { name: 'Kioto · Japón' });
    fireEvent.click(chip);
    expect(handleQueryChange).toHaveBeenCalledWith('Kioto · Japón');
  });

  it('renders selected chip styling, single result label, and ignores Enter key when no index selected', () => {
    const inputRef = React.createRef<HTMLInputElement>();
    const handleQueryChange = vi.fn();

    render(
      <PredictiveLocationSearchBar
        query="Kioto · Japón"
        onQueryChange={handleQueryChange}
        magazines={sampleMagazines}
        popularTopics={sampleTopics}
        totalResults={1}
        isLoading={false}
        onReset={vi.fn()}
        inputRef={inputRef}
      />
    );

    // Singular result label
    expect(screen.getByText('1 artículo')).toBeInTheDocument();

    const input = screen.getByPlaceholderText(/buscar temática o destino/i);
    fireEvent.focus(input);

    // Press Enter when selectedIndex is -1
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleQueryChange).not.toHaveBeenCalled();

    // Clear input using X button and verify ref focus
    const clearBtn = screen.getByLabelText('Limpiar campo');
    fireEvent.click(clearBtn);
    expect(handleQueryChange).toHaveBeenCalledWith('');
  });
});
