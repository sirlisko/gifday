import type { Image } from "../types.ts";
import Modal from "./Modal.tsx";

interface Props {
	dayIndex: string;
	image: Image;
	onClose: () => void;
	onDelete: (dayIndex: string) => void;
	onReplace: (dayIndex: string) => void;
}

const GifView = ({ dayIndex, image, onClose, onDelete, onReplace }: Props) => (
	<Modal isModalOpen onClose={onClose}>
		<div className="flex flex-col items-center gap-6">
			<p className="font-luckiest-guy text-2xl text-gray-500">{image.text}</p>
			<video
				src={image.gif.gif}
				autoPlay
				loop
				muted
				playsInline
				className="mx-auto max-h-[60vh] max-w-full rounded-lg"
			/>
			<div className="flex gap-4">
				<button
					type="button"
					onClick={() => onReplace(dayIndex)}
					className="bg-transparent text-accent py-4 px-8 uppercase text-base font-bold border-2 border-accent rounded-full tracking-widest hover:scale-105 transition-transform"
				>
					Replace
				</button>
				<button
					type="button"
					onClick={() => {
						onDelete(dayIndex);
						onClose();
					}}
					className="bg-transparent text-red-400 py-4 px-8 uppercase text-base font-bold border-2 border-red-300 rounded-full tracking-widest hover:bg-red-50 hover:scale-105 transition-transform"
				>
					Delete
				</button>
			</div>
		</div>
	</Modal>
);

export default GifView;
