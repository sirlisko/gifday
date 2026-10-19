import type { Image } from "../types.ts";

export const getRandomGif = async (
	text: string,
): Promise<Image["gif"] | undefined> => {
	const response = await fetch(
		`/.netlify/functions/gif?q=${encodeURIComponent(text)}`,
	);
	if (!response.ok) throw new Error(`GIF request failed: ${response.status}`);
	const { data } = await response.json();
	// GIPHY's random endpoint returns an empty array when nothing matches
	if (Array.isArray(data)) return undefined;
	return {
		gif: data.images.downsized_small.mp4,
		still: data.images["480w_still"].url,
	};
};
