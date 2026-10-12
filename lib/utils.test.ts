import { describe, it, expect } from 'vitest';
import { cn } from './utils.ts';

describe('lib/utils cn helper', () => {
  it('combines multiple class names', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('resolves conflicting tailwind classes via twMerge', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles conditional classes and falsy values', () => {
    expect(cn('btn', false && 'hidden', null, undefined, 'btn-primary')).toBe('btn btn-primary');
  });

  it('handles array and object structures', () => {
    expect(cn(['foo', 'bar'], { active: true, disabled: false })).toBe('foo bar active');
  });
});
