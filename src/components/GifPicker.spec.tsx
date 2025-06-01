import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import GifPicker from "./GifPicker";

jest.mock("utils/gifAPI", () => ({
	getRandomGif: () =>
		new Promise((resolve) =>
			resolve({ gif: "foobar.mp4", still: "foobar.img" }),
		),
}));

describe("GifPicker Component", () => {
	const props = {
		selectedDay: "0-0",
		onClosePicker: jest.fn(),
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
		fireEvent.submit(screen.getByRole("button", { name: "yo!" }));
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
		fireEvent.submit(screen.getByRole("button", { name: "yo!" }));
		expect(await screen.findByText("loading...")).toBeVisible();
	});
});
