export const getRandomGif = (text: string) =>
	fetch(`/.netlify/functions/gif?q=${encodeURIComponent(text)}`)
		.then((response) => response.json())
		.then(
			({ data }) =>
				!Array.isArray(data) && {
					gif: data.images.downsized_small.mp4,
					still: data.images["480w_still"].url,
				},
		);
