import type { Image } from "../types.ts";

interface Props {
	gifObj: Image;
	dynamic?: boolean;
}

const GifTile = ({ gifObj }: Props) =>
	gifObj ? (
		<video
			key={gifObj.gif.gif}
			title={gifObj.text}
			loop
			autoPlay
			muted
			playsInline
			className="w-full h-full object-cover"
			src={gifObj.gif.gif}
		/>
	) : (
		<></>
	);

export default GifTile;
