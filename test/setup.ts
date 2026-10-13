import '@testing-library/jest-dom/vitest';

// Polyfill worker_threads.markAsUncloneable for Node <22 and environments lacking native support
try {
  const workerThreads = require('node:worker_threads');
  if (workerThreads && typeof workerThreads.markAsUncloneable !== 'function') {
    workerThreads.markAsUncloneable = () => {};
  }
} catch {
  // ignore if worker_threads is not accessible
}

const globalObj = globalThis as unknown as { webidl?: { util?: { markAsUncloneable?: () => void } } };
if (globalObj.webidl?.util && typeof globalObj.webidl.util.markAsUncloneable !== 'function') {
  globalObj.webidl.util.markAsUncloneable = () => {};
}

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
