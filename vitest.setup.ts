import "@testing-library/jest-dom/vitest";

window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
window.HTMLMediaElement.prototype.pause = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();
