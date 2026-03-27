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
			<p className="text-sm font-black uppercase tracking-widest text-brand-text/50">
				{image.text}
			</p>
			<video
				src={image.gif.gif}
				autoPlay
				loop
				muted
				playsInline
				className="mx-auto max-h-[60vh] max-w-full border-2 border-black shadow-[4px_4px_0_0_#000]"
			/>
			<div className="flex gap-3">
				<button
					type="button"
					onClick={() => onReplace(dayIndex)}
					className="border-2 border-black px-8 py-3 text-sm font-black uppercase tracking-widest bg-secondary text-white shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
				>
					Replace
				</button>
				<button
					type="button"
					onClick={() => {
						onDelete(dayIndex);
						onClose();
					}}
					className="border-2 border-danger px-8 py-3 text-sm font-black uppercase tracking-widest text-danger bg-surface shadow-[3px_3px_0_0_#DC2626] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
				>
					Delete
				</button>
			</div>
		</div>
	</Modal>
);

export default GifView;
