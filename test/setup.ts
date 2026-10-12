import '@testing-library/jest-dom/vitest';

// Polyfill window.matchMedia for jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Polyfill window.scrollTo
window.scrollTo = () => {};

// Polyfill scrollIntoView on HTMLElement in jsdom
window.HTMLElement.prototype.scrollIntoView = function () {};
