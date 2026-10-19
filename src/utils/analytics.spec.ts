import { track } from "./analytics.ts";

describe("track", () => {
	afterEach(() => {
		window.umami = undefined;
	});

	it("should forward events to Umami", () => {
		window.umami = { track: vi.fn() };
		track("gif-saved", { day: "today" });
		expect(window.umami.track).toHaveBeenCalledWith("gif-saved", {
			day: "today",
		});
	});

	it("should do nothing when Umami isn't loaded", () => {
		expect(() => track("sign-in")).not.toThrow();
	});

	it("should never throw when Umami fails", () => {
		window.umami = {
			track: () => {
				throw new Error("blocked");
			},
		};
		expect(() => track("sign-in")).not.toThrow();
	});
});
