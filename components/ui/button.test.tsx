import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button.tsx';

describe('UI Button Component', () => {
  it('renders default button with click handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    const btn = screen.getByRole('button', { name: 'Click Me' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('bg-[#2A3E92]');

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders disabled button', () => {
    render(<Button disabled>Disabled Button</Button>);
    const btn = screen.getByRole('button', { name: 'Disabled Button' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveClass('disabled:opacity-50');
  });

  it('supports various style variants', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border-2');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[#EEF2FF]');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:bg-[#EEF2FF]');

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole('button')).toHaveClass('underline-offset-4');

    rerender(<Button variant="voyage">Voyage</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[#2A3E92]');

    rerender(<Button variant="stTropaz">St Tropaz</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[#2A3E92]');

    rerender(<Button variant="lpGold">Gold</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[#FFC72C]');

    rerender(<Button variant="sand">Sand</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-[#F8F9FC]');
  });

  it('supports size variants', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-9 w-9');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
