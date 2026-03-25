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

	const [dayStr, monthStr] = selectedDay.split("-");
	const dayDate = new Date(new Date().getFullYear(), Number(monthStr), Number(dayStr) + 1);
	const dayLabel = dayDate.toLocaleDateString("en-US", { month: "long", day: "numeric" });

	return (
		<Modal
			isModalOpen={Boolean(selectedDay)}
			onClose={() => onClosePicker(selectedImg)}
		>
			<div className="flex flex-col items-center">
				<p className="font-luckiest-guy text-lg text-gray-400 mb-4">{dayLabel}</p>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						return textInput.current?.value && getGif(textInput.current.value);
					}}
					className="flex items-center w-full"
				>
					<input
						type="text"
						name="what"
						ref={textInput}
						defaultValue={image?.text}
						placeholder="search for a gif..."
					className="border-0 border-b border-accent text-3xl outline-accent py-1 px-4 mx-auto w-[calc(100%-3.5rem)] placeholder:text-gray-300"
					/>
					<button
						type="submit"
						aria-label="Search"
						className="bg-accent border-none rounded-full text-white h-12 w-12 ml-2 flex items-center justify-center shrink-0 hover:scale-105 transition-transform"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
					</button>
				</form>
				{error && (
					<div className="text-center">
						Ooops! Something went wrong :( <p>{error}</p>
					</div>
				)}
				{loading && (
					<svg role="status" aria-label="loading" className="mt-4 w-8 h-8 animate-spin text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
					</svg>
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
									className="mx-auto my-2 max-h-64 max-w-full rounded-lg"
								/>
								<div className="flex gap-4 mt-2">
									<button
										type="button"
										onClick={() => getGif(textInput.current?.value ?? image.text)}
										className="bg-transparent text-accent py-4 px-6 uppercase text-base font-bold border-2 border-accent rounded-full tracking-widest hover:scale-105 transition-transform"
									>
										Try another
									</button>
									<button
										type="button"
										onClick={() => onClosePicker(image)}
										className="bg-gradient-to-r from-accent to-alternate text-white py-4 px-12 uppercase text-base font-bold border-none rounded-full tracking-widest hover:scale-105 transition-transform"
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
