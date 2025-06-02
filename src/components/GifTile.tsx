import type { Image } from "../types.ts";

interface Props {
	gifObj: Image;
	dynamic?: boolean;
}

const GifTile = ({ gifObj, dynamic }: Props) =>
	gifObj ? (
		<div className="relative">
			{dynamic && (
				<img
					src={gifObj.gif.still}
					alt={gifObj.text}
					className="absolute inset-0 w-full h-full object-cover"
				/>
			)}
			<video
				key={gifObj.gif.gif}
				title={gifObj.text}
				loop
				autoPlay
				muted
				playsInline
				className="w-full h-full object-cover"
			>
				<source src={gifObj.gif.gif} type="video/mp4" />
			</video>
		</div>
	) : (
		<></>
	);

export default GifTile;
