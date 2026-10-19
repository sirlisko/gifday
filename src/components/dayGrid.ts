import type { DailyGifs } from "../types.ts";
import type { DayState } from "./DayButton.tsx";

export const MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export interface DayGridProps {
	year: number;
	dailyGifs: DailyGifs;
	dayState: (dayKey: string) => DayState;
	activeDay?: string;
	onActive: (dayKey: string | undefined) => void;
	onSelectedDay: (dayKey: string) => void;
}
