import React from "react";
import { render, screen } from "@testing-library/react";

import GifTile from "./GifTile";

jest.mock("utils/gifAPI", () => ({
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
		expect(screen.getByTitle("foobar").innerHTML).toEqual(
			'<source src="foobar.mp4" type="video/mp4">',
		);
	});

	it("should render properly - dynamic", () => {
		render(<GifTile {...props} dynamic />);
		expect(screen.getByAltText("foobar")).toBeVisible();
	});
});
