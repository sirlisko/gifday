import { act, render, screen } from "@testing-library/react";

import GifTile from "./GifTile";

const gifObj = {
	gif: {
		gif: "foobar.mp4",
		still: "foobar.img",
	},
	text: "foobar",
};

// useInView creates its shared observer once, so the callback outlives each stub
let onIntersect: IntersectionObserverCallback = () => {};

function stubBrowser({ reducedMotion }: { reducedMotion: boolean }) {
	vi.stubGlobal(
		"IntersectionObserver",
		class {
			constructor(callback: IntersectionObserverCallback) {
				onIntersect = callback;
			}
			observe() {}
			unobserve() {}
		},
	);
	vi.stubGlobal("matchMedia", () => ({
		matches: reducedMotion,
		addEventListener() {},
		removeEventListener() {},
	}));
	return (target: Element, isIntersecting: boolean) =>
		act(() =>
			onIntersect(
				[{ target, isIntersecting } as IntersectionObserverEntry],
				{} as IntersectionObserver,
			),
		);
}

describe("GifTile Component", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("should show the still image when idle", () => {
		render(<GifTile gifObj={gifObj} />);
		expect(screen.getByTitle("foobar")).toHaveAttribute("src", "foobar.img");
	});

	it("should play the video when playing", () => {
		render(<GifTile gifObj={gifObj} playing />);
		expect(screen.getByTitle("foobar")).toHaveAttribute("src", "foobar.mp4");
	});

	it("should fall back to the video when there is no still", () => {
		render(
			<GifTile gifObj={{ ...gifObj, gif: { ...gifObj.gif, still: "" } }} />,
		);
		expect(screen.getByTitle("foobar")).toHaveAttribute("src", "foobar.mp4");
	});

	it("should play the video while on screen", () => {
		const intersect = stubBrowser({ reducedMotion: false });
		const { container } = render(<GifTile gifObj={gifObj} />);
		const wrapper = container.firstElementChild as Element;

		intersect(wrapper, true);
		expect(screen.getByTitle("foobar")).toHaveAttribute("src", "foobar.mp4");

		intersect(wrapper, false);
		expect(screen.getByTitle("foobar")).toHaveAttribute("src", "foobar.img");
	});

	it("should keep the still on screen when motion is reduced", () => {
		const intersect = stubBrowser({ reducedMotion: true });
		const { container } = render(<GifTile gifObj={gifObj} />);

		intersect(container.firstElementChild as Element, true);
		expect(screen.getByTitle("foobar")).toHaveAttribute("src", "foobar.img");
	});
});
