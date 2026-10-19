import { fireEvent, render, screen } from "@testing-library/react";

import MonthGrid from "./MonthGrid";

describe("MonthGrid Component", () => {
	const props = {
		year: 2026,
		initialMonth: 9,
		dailyGifs: {},
		dayState: () => "past" as const,
		onActive: vi.fn(),
		onSelectedDay: vi.fn(),
	};

	it("should show the initial month's days", () => {
		render(<MonthGrid {...props} />);
		expect(screen.getByRole("heading", { name: "October" })).toBeVisible();
		expect(screen.getByRole("button", { name: "October 31" })).toBeVisible();
		expect(screen.getByRole("button", { name: "October" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
	});

	it("should switch month", () => {
		render(<MonthGrid {...props} />);
		fireEvent.click(screen.getByRole("button", { name: "February" }));
		expect(screen.getByRole("heading", { name: "February" })).toBeVisible();
		expect(screen.getByRole("button", { name: "February 28" })).toBeVisible();
		expect(
			screen.queryByRole("button", { name: "February 29" }),
		).not.toBeInTheDocument();
	});

	it("should select a day", () => {
		render(<MonthGrid {...props} />);
		fireEvent.click(screen.getByRole("button", { name: "October 5" }));
		expect(props.onSelectedDay).toHaveBeenCalledWith("4-9-2026");
	});
});
