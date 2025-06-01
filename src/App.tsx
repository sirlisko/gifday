import { useEffect, useState } from "react";
import GifPicker from "./components/GifPicker";
import YearView from "./components/YearView";
import type { DailyGifs, Image } from "./types";

const App = () => {
	const [dailyGifs, setDailyGifs] = useState<DailyGifs>({});
	const [selectedDay, setSelectedDay] = useState<string>();

	useEffect(() => {
		const local = localStorage.getItem("dailyGifs");
		if (local) {
			try {
				const parsedLocal = JSON.parse(local);
				setDailyGifs(parsedLocal);
			} catch {
				localStorage.removeItem("dailyGifs");
			}
		}
	}, []);

	const saveGif = (image: Image) => {
		if (selectedDay) {
			const newdailyGifs = { ...dailyGifs, [selectedDay]: image };
			setDailyGifs(newdailyGifs);
			setSelectedDay(undefined);
			localStorage.setItem("dailyGifs", JSON.stringify(newdailyGifs));
		}
	};

	return (
		<div>
			<header className="font-luckiest-guy text-center my-12">
				<h1 className="text-5xl">Have a gify day!</h1>
				<p>Your year in gifs...</p>
			</header>
			{selectedDay && (
				<GifPicker
					selectedDay={selectedDay}
					selectedImg={dailyGifs[selectedDay]}
					onClosePicker={(image) =>
						image ? saveGif(image) : setSelectedDay(undefined)
					}
				/>
			)}

			<div className="min-h-[50vh]">
				<YearView dailyGifs={dailyGifs} onSelectedDay={setSelectedDay} />
			</div>
			<footer className="text-center mt-8">
				<p>
					Made with ♥ by{" "}
					<a
						href="https://sirlisko.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-current font-bold"
					>
						Luca Lischetti (@sirLisko)
					</a>
				</p>
				<p>
					Powered By{" "}
					<a
						href="https://giphy.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="text-current font-bold"
					>
						GIPHY
					</a>
				</p>
			</footer>
		</div>
	);
};

export default App;
