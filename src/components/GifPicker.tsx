import { Fragment, useState, useEffect, useRef } from "react";
import Modal from "./Modal.tsx";
import GifTile from "./GifTile.tsx";
import { getRandomGif } from "../utils/gifAPI.ts";
import type { Image } from "../types.ts";

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

	return (
		<Modal
			isModalOpen={Boolean(selectedDay)}
			onClose={() => onClosePicker(selectedImg)}
		>
			<div className="flex flex-col items-center">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						return textInput.current?.value && getGif(textInput.current.value);
					}}
					className="flex items-center"
				>
					<input
						type="text"
						name="what"
						ref={textInput}
						defaultValue={image?.text}
						className="border-0 border-b border-accent text-3xl outline-accent py-1 px-4 mx-auto w-[calc(100%-3.5rem)]"
					/>
					<button
						type="submit"
						className="bg-accent text-2xl border-none rounded-full text-white font-bold h-12 w-12 ml-2 text-center p-0"
					>
						yo!
					</button>
				</form>
				{error && (
					<div className="text-center">
						Ooops! Something went wrong :( <p>{error}</p>
					</div>
				)}
				{loading && <span>loading...</span>}
				{image && (
					<Fragment>
						{!loading && (
							<Fragment>
								<GifTile gifObj={image} />
								<button
									type="button"
									onClick={() => onClosePicker(image)}
									className="bg-gradient-to-r from-accent to-alternate text-white py-4 px-12 uppercase text-base font-bold border-none rounded-full mx-auto block tracking-widest hover:scale-105 transition-transform"
								>
									You Got It!
								</button>
							</Fragment>
						)}
					</Fragment>
				)}
			</div>
		</Modal>
	);
};

export default GifPicker;
