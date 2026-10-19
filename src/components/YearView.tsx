import { getDaysInMonth, startOfDay } from "date-fns";
import times from "lodash.times";
import { useState } from "react";
import type { DailyGifs } from "../types.js";
import { parseDayKey, toDayKey } from "../utils/dayKey.js";
import DayButton, { type DayState } from "./DayButton.jsx";

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

interface Props {
	dailyGifs: DailyGifs;
	onSelectedDay: (dayIndex: string) => void;
	year: number;
}

export const YearView = ({ dailyGifs, onSelectedDay, year }: Props) => {
	const [today] = useState(() => startOfDay(new Date()));
	const todayKey = toDayKey(today);
	const [activeDay, setActiveDay] = useState<string>();
	const dayOfTheMonth = times(12).map((month) =>
		getDaysInMonth(new Date(year, month)),
	);

	const dayState = (dayKey: string): DayState => {
		if (dayKey === todayKey) return "today";
		return parseDayKey(dayKey) > today ? "future" : "past";
	};

	return (
		<table className="mx-auto block md:table border-collapse">
			<tbody className="flex md:block">
				{dayOfTheMonth.map((days, monthIndex) => (
					<tr key={MONTHS[monthIndex]} className="flex flex-col md:table-row">
						<td className="table-cell p-0 pr-2 text-right align-middle text-[0.6rem] font-bold uppercase tracking-wide text-brand-text/40 w-4 md:w-10 h-[8vw] md:h-[3vw]">
							<span className="md:hidden">{MONTHS[monthIndex][0]}</span>
							<span className="hidden md:inline">{MONTHS[monthIndex]}</span>
						</td>
						{times(days).map((day) => {
							const dayKey = `${day}-${monthIndex}-${year}`;
							return (
								<td key={dayKey} className="m-0 p-[1px] align-top leading-none">
									<DayButton
										dayKey={dayKey}
										dayNumber={day + 1}
										state={dayState(dayKey)}
										image={dailyGifs[dayKey]}
										playing={activeDay === dayKey}
										onSelect={onSelectedDay}
										onActive={setActiveDay}
										className="h-[8vw] w-[8vw] md:h-[3vw] md:w-[3vw] text-[0.5rem] sm:text-[0.65rem] md:text-[0.6vw]"
									/>
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default YearView;
