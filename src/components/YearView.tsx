import { startOfDay } from "date-fns";
import { useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery.ts";
import type { DailyGifs } from "../types.ts";
import { parseDayKey, toDayKey } from "../utils/dayKey.ts";
import MonthGrid from "./MonthGrid.tsx";
import YearGrid from "./YearGrid.tsx";
import type { DayGridProps } from "./dayGrid.ts";

interface Props {
	dailyGifs: DailyGifs;
	onSelectedDay: (dayIndex: string) => void;
	year: number;
}

export const YearView = ({ dailyGifs, onSelectedDay, year }: Props) => {
	const [today] = useState(() => startOfDay(new Date()));
	const todayKey = toDayKey(today);
	const [activeDay, setActiveDay] = useState<string>();
	const isWide = useMediaQuery("(min-width: 1024px)");

	const gridProps: DayGridProps = {
		year,
		dailyGifs,
		dayState: (dayKey) => {
			if (dayKey === todayKey) return "today";
			return parseDayKey(dayKey) > today ? "future" : "past";
		},
		activeDay,
		onActive: setActiveDay,
		onSelectedDay,
	};

	if (isWide) return <YearGrid {...gridProps} />;

	return (
		<MonthGrid
			key={year}
			initialMonth={year === today.getFullYear() ? today.getMonth() : 0}
			{...gridProps}
		/>
	);
};

export default YearView;
