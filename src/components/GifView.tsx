import { primaryButton } from "../styles/buttons.ts";
import type { Image } from "../types.ts";
import { formatDayKey } from "../utils/dayKey.ts";
import Modal from "./Modal.tsx";

interface Props {
	dayIndex: string;
	image: Image;
	onClose: () => void;
	onDelete: (dayIndex: string) => void;
	onReplace: (dayIndex: string) => void;
}

const GifView = ({ dayIndex, image, onClose, onDelete, onReplace }: Props) => {
	const dayLabel = formatDayKey(dayIndex);

	return (
		<Modal isModalOpen label={`GIF for ${dayLabel}`} onClose={onClose}>
			<div className="flex flex-col items-center gap-6">
				<div className="self-start">
					<h2 className="font-display text-3xl">{dayLabel}</h2>
					<p className="text-sm font-medium text-brand-text/60 mt-1">
						“{image.text}”
					</p>
				</div>
				<video
					src={image.gif.gif}
					title={image.text}
					autoPlay
					loop
					muted
					playsInline
					className="mx-auto max-h-[60vh] max-w-full border-2 border-black"
				/>
				<div className="flex items-center gap-6">
					<button
						type="button"
						onClick={() => {
							onDelete(dayIndex);
							onClose();
						}}
						className="text-sm font-semibold text-danger underline underline-offset-4 decoration-2"
					>
						Delete
					</button>
					<button
						type="button"
						onClick={() => onReplace(dayIndex)}
						className={primaryButton}
					>
						Replace GIF
					</button>
				</div>
			</div>
		</Modal>
	);
};

export default GifView;
