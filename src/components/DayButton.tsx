import type { Image } from "../types.ts";
import { formatDayKey } from "../utils/dayKey.ts";
import GifTile from "./GifTile.tsx";

export type DayState = "past" | "today" | "future";

interface Props {
	dayKey: string;
	dayNumber: number;
	state: DayState;
	image?: Image;
	playing: boolean;
	className: string;
	onSelect: (dayKey: string) => void;
	onActive: (dayKey: string | undefined) => void;
}

const stateClasses: Record<DayState, string> = {
	past: "border-transparent bg-day text-brand-text/60 hover:border-black hover:text-brand-text",
	today: "border-black bg-primary font-bold shadow-[2px_2px_0_0_#000]",
	future:
		"border-brand-text/15 border-dashed bg-transparent text-brand-text/30 cursor-default",
};

const DayButton = ({
	dayKey,
	dayNumber,
	state,
	image,
	playing,
	className,
	onSelect,
	onActive,
}: Props) => (
	<button
		type="button"
		// Future days can't be filled yet, but stay viewable if they already hold a GIF
		disabled={state === "future" && !image}
		onClick={() => onSelect(dayKey)}
		onMouseEnter={() => onActive(dayKey)}
		onMouseLeave={() => onActive(undefined)}
		onFocus={() => onActive(dayKey)}
		onBlur={() => onActive(undefined)}
		aria-label={[
			formatDayKey(dayKey),
			image?.text,
			state === "today" && "today",
		]
			.filter(Boolean)
			.join(", ")}
		className={[
			"block text-center p-0 m-0 overflow-hidden border-2 transition-colors",
			image ? "border-black bg-white" : stateClasses[state],
			className,
		].join(" ")}
	>
		{image ? <GifTile gifObj={image} playing={playing} /> : dayNumber}
	</button>
);

export default DayButton;
