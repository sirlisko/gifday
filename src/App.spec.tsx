import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("./lib/supabase", () => ({
	supabase: {
		auth: {
			getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
			onAuthStateChange: vi.fn().mockReturnValue({
				data: { subscription: { unsubscribe: vi.fn() } },
			}),
			signOut: vi.fn(),
		},
	},
}));

vi.mock("./lib/gifsDB", () => ({
	loadGifs: vi.fn().mockResolvedValue({}),
	saveGif: vi.fn().mockResolvedValue(undefined),
	deleteGif: vi.fn().mockResolvedValue(undefined),
}));

import App from "./App";

it("renders without crashing", async () => {
	await act(async () => {
		render(<App />);
	});
});

describe("App Component", () => {
	it("should render properly", async () => {
		await act(async () => {
			render(<App />);
		});
		expect(screen.getByRole("heading")).toBeVisible();
	});
});

describe("Deleting a GIF", () => {
	const dayKey = `0-0-${new Date().getFullYear()}`;

	beforeEach(() => {
		localStorage.setItem(
			"dailyGifs",
			JSON.stringify({
				[dayKey]: { text: "pizza", gif: { gif: "pizza.mp4", still: "" } },
			}),
		);
	});

	afterEach(() => localStorage.clear());

	it("can be undone", async () => {
		await act(async () => {
			render(<App />);
		});
		fireEvent.click(screen.getByTitle("pizza"));
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));
		expect(screen.queryByTitle("pizza")).not.toBeInTheDocument();
		expect(JSON.parse(localStorage.getItem("dailyGifs") ?? "")).toEqual({});

		fireEvent.click(screen.getByRole("button", { name: "Undo" }));
		expect(screen.getByTitle("pizza")).toBeInTheDocument();
		expect(JSON.parse(localStorage.getItem("dailyGifs") ?? "")).toHaveProperty(
			dayKey,
		);
	});
});
