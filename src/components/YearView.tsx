import { getDaysInMonth } from "date-fns";
import times from "lodash.times";
import { useEffect, useRef, useState } from "react";
import type { DailyGifs } from "../types.js";
import GifTile from "./GifTile.jsx";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Props {
	dailyGifs: DailyGifs;
	onSelectedDay: (dayIndex: string) => void;
}

export const YearView = ({ dailyGifs, onSelectedDay }: Props) => {
	const [today] = useState(() => new Date());
	const thisYear = today.getFullYear();
	const todayIndex = `${today.getDate() - 1}-${today.getMonth()}`;
	const dayOfTheMonth = times(12).map((month) =>
		getDaysInMonth(new Date(thisYear, month)),
	);
	const todayRef = useRef<HTMLButtonElement>(null);
	useEffect(() => {
		todayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
	}, []);

	return (
		<table className="mx-auto block md:table border-collapse">
			<tbody className="flex md:block">
				{dayOfTheMonth.map((days, monthIndex) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<tr key={monthIndex} className="flex flex-col md:table-row">
						<td className="table-cell p-0 pr-1 text-right align-middle text-xs text-gray-400 font-sans w-4 md:w-8 h-[8vw] md:h-[3vw]">
							<span className="md:hidden">{MONTHS[monthIndex][0]}</span>
							<span className="hidden md:inline">{MONTHS[monthIndex]}</span>
						</td>
						{times(days).map((day) => {
							const index = `${day}-${monthIndex}`;
							const isToday = index === todayIndex;
							return (
								<td key={index} className="m-0 p-0 align-top leading-none">
									<button
										ref={isToday ? todayRef : undefined}
										type="button"
										onClick={() => onSelectedDay(index)}
										className={`block border rounded-lg bg-transparent text-center p-0 m-0 overflow-hidden h-[8vw] w-[8vw] text-[0.5rem] sm:text-[0.65rem] md:h-[3vw] md:w-[3vw] md:text-[0.6vw] hover:text-black hover:border-black ${isToday ? "border-accent text-accent font-bold animate-pulse" : "border-gray-light text-gray-light"}`}
									>
										{dailyGifs[index] ? (
											<GifTile gifObj={dailyGifs[index]} />
										) : (
											`${day + 1}`
										)}
									</button>
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
