import { useRef, useState } from "react";
import { field, primaryButton, secondaryButton } from "../styles/buttons.ts";
import type { Image } from "../types.ts";
import { track } from "../utils/analytics.ts";
import { formatDayKey } from "../utils/dayKey.ts";
import { getRandomGif } from "../utils/gifAPI.ts";
import Modal from "./Modal.tsx";

interface Props {
	selectedDay: string;
	selectedImg?: Image;
	onClosePicker: (image?: Image) => void;
}

const GifPicker = ({ selectedDay, selectedImg, onClosePicker }: Props) => {
	const [image, setImage] = useState(selectedImg);
	const [error, setError] = useState<string>();
	const [loading, setLoading] = useState(false);
	const textInput = useRef<HTMLInputElement>(null);

	const getGif = (text: string) => {
		setLoading(true);
		setError(undefined);
		getRandomGif(text)
			.then((gif) => {
				if (gif) {
					setImage({ text, gif });
				} else {
					track("search-no-results");
					setError(`No GIFs found for “${text}”. Try another word.`);
				}
			})
			.catch(() => {
				setError("Couldn't reach GIPHY. Check your connection and try again.");
			})
			.finally(() => setLoading(false));
	};

	const dayLabel = formatDayKey(selectedDay);

	return (
		<Modal
			isModalOpen
			label={`Pick a GIF for ${dayLabel}`}
			onClose={() => onClosePicker()}
		>
			<div className="flex flex-col items-center">
				<h2 className="font-display text-3xl self-start mb-4">{dayLabel}</h2>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const text = textInput.current?.value.trim();
						if (text) getGif(text);
					}}
					className="flex items-stretch w-full gap-2"
				>
					<input
						type="text"
						name="what"
						aria-label="Search GIFs"
						ref={textInput}
						data-autofocus
						defaultValue={image?.text}
						placeholder="Sum up the day in a word or two"
						className={`${field} flex-1 min-w-0 placeholder:text-brand-text/35`}
					/>
					<button
						type="submit"
						aria-label="Search"
						className="bg-primary border-2 border-black w-12 flex items-center justify-center shrink-0 hover:bg-black hover:text-primary transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="w-5 h-5"
							aria-hidden="true"
						>
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
					</button>
				</form>
				{error && (
					<p
						role="alert"
						className="mt-4 w-full px-4 py-3 border-2 border-danger bg-danger/10 text-danger text-sm font-semibold"
					>
						{error}
					</p>
				)}
				{loading && (
					<output aria-label="loading" className="mt-6 flex justify-center">
						<svg
							aria-hidden="true"
							className="w-8 h-8 animate-spin motion-reduce:animate-none text-brand-text/40"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
							/>
						</svg>
					</output>
				)}
				{image && !loading && (
					<>
						<video
							key={image.gif.gif}
							title={image.text}
							src={image.gif.gif}
							autoPlay
							loop
							muted
							playsInline
							className="mx-auto mt-6 mb-6 max-h-64 max-w-full border-2 border-black"
						/>
						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => {
									track("try-another");
									getGif(textInput.current?.value.trim() || image.text);
								}}
								className={secondaryButton}
							>
								Try another
							</button>
							<button
								type="button"
								onClick={() => onClosePicker(image)}
								className={primaryButton}
							>
								Save GIF
							</button>
						</div>
					</>
				)}
			</div>
		</Modal>
	);
};

export default GifPicker;
