import { Fragment, useEffect, useRef, useState } from "react";
import type { Image } from "../types.ts";
import { getRandomGif } from "../utils/gifAPI.ts";
import Modal from "./Modal.tsx";

interface Props {
	selectedDay?: string;
	selectedImg?: Image;
	onClosePicker: (image?: Image) => void;
}

const GifPicker = ({ selectedDay, selectedImg, onClosePicker }: Props) => {
	const [image, setImage] = useState(selectedImg);
	const [error, setError] = useState<string>();
	const [loading, setLoading] = useState<boolean>();
	const getGif = (text: string) => {
		setLoading(true);
		getRandomGif(text)
			.then((gif) => {
				if (!gif) {
					return setError("we didn't find your gif");
				}
				setError(undefined);
				setImage({ text, gif });
				setLoading(false);
			})
			.catch(() => {
				setError("Please try again later");
				setLoading(false);
			});
	};

	const textInput = useRef<HTMLInputElement>(null);
	useEffect(() => {
		textInput?.current?.focus();
	}, []);

	if (!selectedDay) {
		return null;
	}

	const [dayStr, monthStr, yearStr] = selectedDay.split("-");
	const dayDate = new Date(
		Number(yearStr),
		Number(monthStr),
		Number(dayStr) + 1,
	);
	const dayLabel = dayDate.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	});

	return (
		<Modal
			isModalOpen={Boolean(selectedDay)}
			onClose={() => onClosePicker(selectedImg)}
		>
			<div className="flex flex-col items-center">
				<p className="text-xs font-bold uppercase tracking-widest text-brand-text/40 mb-4">
					{dayLabel}
				</p>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						return textInput.current?.value && getGif(textInput.current.value);
					}}
					className="flex items-center w-full gap-2"
				>
					<input
						type="text"
						name="what"
						ref={textInput}
						defaultValue={image?.text}
						placeholder="search for a gif..."
						className="flex-1 border-b-2 border-black text-2xl font-medium outline-none py-2 px-1 bg-transparent placeholder:text-brand-text/25 focus:border-primary transition-colors"
					/>
					<button
						type="submit"
						aria-label="Search"
						className="bg-primary border-2 border-black h-11 w-11 flex items-center justify-center shrink-0 shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
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
					<div className="mt-4 w-full px-4 py-3 border-2 border-danger bg-danger/10 text-danger text-sm font-bold">
						Oops! {error}
					</div>
				)}
				{loading && (
					<output aria-label="loading" className="mt-6 flex justify-center">
						<svg
							aria-hidden="true"
							className="w-8 h-8 animate-spin text-brand-text/40"
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
				{image && (
					<Fragment>
						{!loading && (
							<Fragment>
								<video
									key={image.gif.gif}
									title={image.text}
									src={image.gif.gif}
									autoPlay
									loop
									muted
									playsInline
									className="mx-auto my-4 max-h-64 max-w-full border-2 border-black shadow-[4px_4px_0_0_#000]"
								/>
								<div className="flex gap-3 mt-2">
									<button
										type="button"
										onClick={() =>
											getGif(textInput.current?.value ?? image.text)
										}
										className="border-2 border-black px-6 py-3 text-sm font-black uppercase tracking-widest bg-surface shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
									>
										Try another
									</button>
									<button
										type="button"
										onClick={() => onClosePicker(image)}
										className="border-2 border-black px-8 py-3 text-sm font-black uppercase tracking-widest bg-primary shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all"
									>
										You Got It!
									</button>
								</div>
							</Fragment>
						)}
					</Fragment>
				)}
			</div>
		</Modal>
	);
};

export default GifPicker;
