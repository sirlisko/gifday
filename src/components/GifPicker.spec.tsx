import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import GifPicker from "./GifPicker";

vi.mock("../utils/gifAPI.ts", () => ({
	getRandomGif: () =>
		new Promise((resolve) => {
			setTimeout(() => {
				resolve({ gif: "foobar.mp4", still: "foobar.img" });
			}, 10);
		}),
}));

describe("GifPicker Component", () => {
	const props = {
		selectedDay: "0-0",
		onClosePicker: vi.fn(),
	};

	it("should fetch a new gif if form submitted", async () => {
		render(
			<GifPicker {...props}>
				<div>foo</div>
			</GifPicker>,
		);
		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "foobar" },
		});
		fireEvent.submit(screen.getByRole("button", { name: "Search" }));
		expect(await screen.findByTitle("foobar")).toBeVisible();
		fireEvent.click(screen.getByRole("button", { name: "You Got It!" }));
		expect(props.onClosePicker).toHaveBeenCalledWith({
			gif: {
				gif: "foobar.mp4",
				still: "foobar.img",
			},
			text: "foobar",
		});
	});

	it("should show loading spinner when fetching", async () => {
		render(
			<GifPicker {...props}>
				<div>foo</div>
			</GifPicker>,
		);
		fireEvent.change(screen.getByRole("textbox"), {
			target: { value: "foobar" },
		});
		fireEvent.submit(screen.getByRole("button", { name: "Search" }));
		expect(await screen.findByRole("status")).toBeInTheDocument();
	});
});
