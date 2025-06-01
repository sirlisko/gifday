import { render, screen } from "@testing-library/react";
import React from "react";
import { createRoot } from "react-dom/client";

import { act } from "react-dom/test-utils";
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
