import { fireEvent, render, screen, within } from "@testing-library/react";
import mockdate from "mockdate";
import { vi } from "vitest";

import YearView from "./YearView";

describe("YearView Component", () => {
	const props = {
		dailyGifs: {},
		onSelectedDay: vi.fn(),
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

	it("should label days with their date", () => {
		mockdate.set("3/14/2019");
		render(
			<YearView
				{...props}
				dailyGifs={{
					"0-0-2019": { gif: { gif: "bar", still: "" }, text: "pizza" },
				}}
				year={2019}
			/>,
		);
		expect(
			screen.getByRole("button", { name: "January 1, pizza" }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "March 14, today" }),
		).toBeInTheDocument();
	});

	it("should lock empty future days but keep filled ones viewable", () => {
		mockdate.set("3/14/2019");
		render(
			<YearView
				{...props}
				dailyGifs={{
					"0-11-2019": { gif: { gif: "bar", still: "" }, text: "pizza" },
				}}
				year={2019}
			/>,
		);
		expect(screen.getByRole("button", { name: "March 13" })).toBeEnabled();
		expect(screen.getByRole("button", { name: "March 15" })).toBeDisabled();
		expect(
			screen.getByRole("button", { name: "December 1, pizza" }),
		).toBeEnabled();
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
