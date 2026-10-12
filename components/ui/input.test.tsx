import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './input.tsx';

describe('UI Input Component', () => {
  it('renders input with placeholder, handles typing, and forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    const handleChange = vi.fn();

    render(
      <Input
        ref={ref}
        type="text"
        placeholder="Buscar..."
        className="custom-input"
        onChange={handleChange}
      />
    );

    const input = screen.getByPlaceholderText('Buscar...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('custom-input');
    expect(ref.current).toBeInstanceOf(HTMLInputElement);

    fireEvent.change(input, { target: { value: 'Patagonia' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders disabled state', () => {
    render(<Input disabled placeholder="Disabled" />);
    const input = screen.getByPlaceholderText('Disabled');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50');
  });
});
