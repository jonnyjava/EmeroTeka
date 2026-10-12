import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { useIsMobile } from './use-mobile.ts';

describe('useIsMobile Hook', () => {
  it('returns true when window.innerWidth is less than 768', () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false when window.innerWidth is greater than or equal to 768', () => {
    window.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('executes server snapshot during SSR rendering', () => {
    function TestComponent() {
      const isMobile = useIsMobile();
      return <div>{isMobile ? 'Mobile' : 'Desktop'}</div>;
    }

    const html = renderToString(<TestComponent />);
    expect(html).toContain('Desktop');
  });

  it('subscribes and cleans up event listener on media query changes', () => {
    let listener: (() => void) | null = null;
    const addEventListenerMock = vi.fn((event: string, callback: () => void) => {
      listener = callback;
    });
    const removeEventListenerMock = vi.fn();

    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: vi.fn(),
    }));

    window.innerWidth = 1024;
    const { result, unmount } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));

    // Simulate resizing to mobile
    act(() => {
      window.innerWidth = 400;
      if (listener) listener();
    });

    expect(result.current).toBe(true);

    unmount();
    expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
