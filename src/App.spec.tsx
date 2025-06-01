import { act, render, screen } from "@testing-library/react";
import { createRoot } from "react-dom/client";

import App from "./App";

it("renders without crashing", () => {
	const div = document.createElement("div");
	const root = createRoot(div);
	act(() => {
		root.render(<App />);
		root.unmount();
	});
});

describe("App Component", () => {
	it("should render properly", () => {
		render(<App />);
		expect(screen.getByRole("heading").innerHTML).toEqual("Have a gify day!");
	});
});
