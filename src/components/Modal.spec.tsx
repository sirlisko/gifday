import { render, screen } from "@testing-library/react";
import React from "react";

import Modal from "./Modal";

describe("Modal Component", () => {
	const props = {
		isModalOpen: true,
		onClose: jest.fn(),
	};

	it("should render properly", () => {
		render(
			<Modal {...props}>
				<div data-testid="content">foo</div>
			</Modal>,
		);
		expect(screen.getByTestId("content")).toBeVisible();
	});

	it("should NOT render if isModalOpen is false", () => {
		render(
			<Modal {...props} isModalOpen={false}>
				<div data-testid="content">foo</div>
			</Modal>,
		);
		expect(screen.queryByTestId("content")).not.toBeInTheDocument();
	});
});
