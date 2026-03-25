import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import GifTile from "./GifTile";

vi.mock("../utils/gifAPI.ts", () => ({
	getRandomGif: () => new Promise((resolve) => resolve("foobar")),
}));

const props = {
	gifObj: {
		gif: {
			gif: "foobar.mp4",
			still: "foobar.img",
		},
		text: "foobar",
	},
};

describe("GifTile Component", () => {
	it("should render properly", async () => {
		render(<GifTile {...props} />);
		expect(screen.getByTitle("foobar")).toHaveAttribute("src", "foobar.mp4");
	});

	it("should render properly - dynamic", () => {
		render(<GifTile {...props} dynamic />);
		expect(screen.getByTitle("foobar")).toHaveAttribute("src", "foobar.mp4");
	});
});
