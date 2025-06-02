export const getRandomGif = (text: string) =>
	fetch(`${import.meta.env.VITE_GIF_API_GET_RANDOM}${text}`)
		.then((response) => response.json())
		.then(
			({ data }) =>
				!Array.isArray(data) && {
					gif: data.images.downsized_small.mp4,
					still: data.images["480w_still"].url,
				},
		);
