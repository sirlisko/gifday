import { useState } from "react";
import { getDaysInMonth } from "date-fns";
import times from "lodash.times";
import GifTile from "./GifTile.jsx";
import type { DailyGifs } from "../types.js";

interface Props {
	dailyGifs: DailyGifs;
	onSelectedDay: (dayIndex: string) => void;
}

export const YearView = ({ dailyGifs, onSelectedDay }: Props) => {
	const [thisYear] = useState(new Date().getFullYear());
	const dayOfTheMonth = times(12).map((month) =>
		getDaysInMonth(new Date(thisYear, month)),
	);

	return (
		<table className="mx-auto md:block">
			<tbody className="md:flex">
				{dayOfTheMonth.map((days, monthIndex) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<tr key={monthIndex} className="md:flex md:flex-col">
						{times(days).map((day) => {
							const index = `${day}-${monthIndex}`;
							return (
								<td key={index} className="m-0 p-0">
									{/* biome-ignore lint/a11y/useSemanticElements: <explanation> */}
									<button
										type="button"
										onClick={() => onSelectedDay(index)}
										className="border border-gray-light text-gray-light rounded-lg bg-transparent text-center p-0 m-0 overflow-hidden h-[8vw] w-[8vw] text-[0.25rem] sm:text-[0.5rem] md:h-[3vw] md:w-[3vw] hover:text-black hover:border-black group"
									>
										{dailyGifs[index] ? (
											<div className="w-full h-full">
												<GifTile gifObj={dailyGifs[index]} dynamic />
											</div>
										) : (
											`${day + 1} / ${monthIndex + 1}`
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
