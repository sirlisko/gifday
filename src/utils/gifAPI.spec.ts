import { getRandomGif } from "utils/gifAPI";

const unmockedFetch = global.fetch;

const fakeResponse = {
	data: {
		images: {
			downsized_small: { mp4: "foobar.mp4" },
			"480w_still": { url: "foobar.img" },
		},
	},
};

describe("getRandomGif", () => {
	beforeAll(() => {
		global.fetch = () =>
			Promise.resolve({
				json: () => Promise.resolve(fakeResponse),
			} as Response);
	});

	afterAll(() => {
		global.fetch = unmockedFetch;
	});

	it("should fetch a new gif if form submitted", (done) => {
		getRandomGif("foo").then((gif) => {
			expect(gif).toEqual({ gif: "foobar.mp4", still: "foobar.img" });
			done();
		});
	});
});
