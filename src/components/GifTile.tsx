import { useState } from "react";
import { useInView } from "../hooks/useInView.ts";
import { useMediaQuery } from "../hooks/useMediaQuery.ts";
import type { Image } from "../types.ts";

interface Props {
	gifObj: Image;
	playing?: boolean;
}

// Only tiles on screen play: decoding a whole year of GIFs at once stalls phones
const GifTile = ({ gifObj, playing }: Props) => {
	const [stillFailed, setStillFailed] = useState(false);
	const [wrapper, setWrapper] = useState<HTMLSpanElement | null>(null);
	const inView = useInView(wrapper);
	const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
	const animate = playing || (inView && !reducedMotion);

	return (
		<span ref={setWrapper} className="block w-full h-full">
			{animate || stillFailed || !gifObj.gif.still ? (
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
			)}
		</span>
	);
};

export default GifTile;
