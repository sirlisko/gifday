import React from "react";
import { createRoot } from "react-dom/client";
import { render, screen } from "@testing-library/react";

import App from "./App";
import { act } from "react-dom/test-utils";

it("renders without crashing", () => {
	const div = document.createElement("div");
	const root = createRoot(div);
	// eslint-disable-next-line testing-library/no-unnecessary-act
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
