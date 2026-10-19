import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { track } from "../utils/analytics.ts";
import { getRandomGif } from "../utils/gifAPI.ts";
import GifPicker from "./GifPicker";

vi.mock("../utils/gifAPI.ts", () => ({
	getRandomGif: vi.fn(
		() =>
			new Promise((resolve) => {
				setTimeout(() => {
					resolve({ gif: "foobar.mp4", still: "foobar.img" });
				}, 10);
			}),
	),
}));

vi.mock("../utils/analytics.ts", () => ({ track: vi.fn() }));

describe("GifPicker Component", () => {
	const props = {
		selectedDay: "0-0-2026",
		onClosePicker: vi.fn(),
	};

	it("should fetch a new gif if form submitted", async () => {
		render(<GifPicker {...props} />);
		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "foobar" },
		});
		fireEvent.submit(screen.getByRole("button", { name: "Search" }));
		expect(await screen.findByTitle("foobar")).toBeVisible();
		fireEvent.click(screen.getByRole("button", { name: "Save GIF" }));
		expect(props.onClosePicker).toHaveBeenCalledWith({
			gif: {
				gif: "foobar.mp4",
				still: "foobar.img",
			},
			text: "foobar",
		});
	});

	it("should show loading spinner when fetching", async () => {
		render(<GifPicker {...props} />);
		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "foobar" },
		});
		fireEvent.submit(screen.getByRole("button", { name: "Search" }));
		expect(await screen.findByLabelText("loading")).toBeInTheDocument();
	});

	it("should stop loading and explain when nothing is found", async () => {
		vi.mocked(getRandomGif).mockResolvedValueOnce(undefined);
		render(<GifPicker {...props} />);
		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "zzz" },
		});
		fireEvent.submit(screen.getByRole("button", { name: "Search" }));
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"No GIFs found for “zzz”",
		);
		expect(screen.queryByLabelText("loading")).not.toBeInTheDocument();
		expect(track).toHaveBeenCalledWith("search-no-results");
	});
});
