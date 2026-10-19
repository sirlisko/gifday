import "@testing-library/jest-dom/vitest";

window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
window.HTMLMediaElement.prototype.pause = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();
// jsdom doesn't implement modal dialogs
window.HTMLDialogElement.prototype.showModal = function () {
	this.open = true;
};
window.HTMLDialogElement.prototype.close = function () {
	this.open = false;
};
