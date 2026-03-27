import { fireEvent, render, screen, within } from "@testing-library/react";
import mockdate from "mockdate";
import { vi } from "vitest";

import YearView from "./YearView";

describe("YearView Component", () => {
	const props = {
		dailyGifs: {},
		onSelectedDay: vi.fn(),
		onDeleteDay: vi.fn(),
	};

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should render the correct number of days if not leap year", () => {
		mockdate.set("1/1/2019");
		render(<YearView {...props} year={2019} />);
		expect(screen.getAllByRole("button").length).toBe(365);
	});

	it("should render the correct number of days if leap year", () => {
		mockdate.set("1/1/2000");
		render(<YearView {...props} year={2000} />);
		expect(screen.getAllByRole("button").length).toBe(366);
	});

	it("should render properly with GIF", () => {
		mockdate.set("1/1/2019");
		const newProps = {
			dailyGifs: {
				"0-0-2019": {
					gif: {
						gif: "bar",
						still: "foobar",
					},
					text: "foo",
				},
			},
		};
		render(<YearView {...props} {...newProps} year={2019} />);
		expect(
			within(screen.getAllByRole("button")[0]).getByTitle("foo"),
		).toBeVisible();
	});

	it("should select the correct day", () => {
		mockdate.set("1/1/2019");
		const newProps = {
			dailyGifs: {
				"0-0-2019": {
					gif: {
						gif: "bar",
						still: "foobar",
					},
					text: "foo",
				},
			},
		};
		render(<YearView {...props} {...newProps} year={2019} />);
		fireEvent.click(screen.getAllByRole("button")[0]);
		expect(props.onSelectedDay).toHaveBeenCalled();
		expect(props.onSelectedDay).toHaveBeenCalledWith("0-0-2019");
	});
});
