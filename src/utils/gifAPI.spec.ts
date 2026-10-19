import { getRandomGif } from "./gifAPI.ts";

const unmockedFetch = global.fetch;

const fakeResponse = {
	data: {
		images: {
			downsized_small: { mp4: "foobar.mp4" },
			"480w_still": { url: "foobar.img" },
		},
	},
};

const mockFetch = (body: unknown, ok = true) => {
	global.fetch = vi.fn().mockResolvedValue({
		ok,
		status: ok ? 200 : 502,
		json: () => Promise.resolve(body),
	} as Response);
};

describe("getRandomGif", () => {
	afterAll(() => {
		global.fetch = unmockedFetch;
	});

	it("should fetch a gif through the Netlify function", async () => {
		mockFetch(fakeResponse);
		const gif = await getRandomGif("foo bar");
		expect(global.fetch).toHaveBeenCalledWith(
			"/.netlify/functions/gif?q=foo%20bar",
		);
		expect(gif).toEqual({ gif: "foobar.mp4", still: "foobar.img" });
	});

	it("should return undefined when nothing matches", async () => {
		mockFetch({ data: [] });
		expect(await getRandomGif("foo")).toBeUndefined();
	});

	it("should throw when the request fails", async () => {
		mockFetch({}, false);
		await expect(getRandomGif("foo")).rejects.toThrow();
	});
});
