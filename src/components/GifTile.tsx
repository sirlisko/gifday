import { useState } from "react";
import type { Image } from "../types.ts";

interface Props {
	gifObj: Image;
	playing?: boolean;
}

// A year can hold 366 GIFs; decoding them all at once stalls phones, so tiles show stills until hovered or focused
const GifTile = ({ gifObj, playing }: Props) => {
	const [stillFailed, setStillFailed] = useState(false);
	return playing || stillFailed || !gifObj.gif.still ? (
		<video
			key={gifObj.gif.gif}
			title={gifObj.text}
			loop
			autoPlay
			muted
			playsInline
			className="w-full h-full object-cover pointer-events-none"
			src={gifObj.gif.gif}
		/>
	) : (
		<img
			title={gifObj.text}
			alt=""
			loading="lazy"
			className="w-full h-full object-cover pointer-events-none"
			src={gifObj.gif.still}
			onError={() => setStillFailed(true)}
		/>
	);
};

export default GifTile;
