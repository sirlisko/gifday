import { render, screen } from "@testing-library/react";

import GifTile from "./GifTile";

const gifObj = {
	gif: {
		gif: "foobar.mp4",
		still: "foobar.img",
	},
	text: "foobar",
};

describe("GifTile Component", () => {
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
});
