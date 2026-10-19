import { getDaysInMonth } from "date-fns";
import times from "lodash.times";
import DayButton from "./DayButton.tsx";
import { type DayGridProps, MONTHS } from "./dayGrid.ts";

const YearGrid = ({
	year,
	dailyGifs,
	dayState,
	activeDay,
	onActive,
	onSelectedDay,
}: DayGridProps) => (
	<div className="px-4">
		<table className="mx-auto border-collapse">
			<tbody>
				{MONTHS.map((month, monthIndex) => (
					<tr key={month}>
						<th
							scope="row"
							className="p-0 pr-2 text-right align-middle text-[0.65rem] font-semibold text-brand-text/60 w-10"
						>
							{month.slice(0, 3)}
						</th>
						{times(getDaysInMonth(new Date(year, monthIndex))).map((day) => {
							const dayKey = `${day}-${monthIndex}-${year}`;
							return (
								<td key={dayKey} className="p-[1px] leading-none">
									<DayButton
										dayKey={dayKey}
										dayNumber={day + 1}
										state={dayState(dayKey)}
										image={dailyGifs[dayKey]}
										playing={activeDay === dayKey}
										onSelect={onSelectedDay}
										onActive={onActive}
										className="h-[calc((100vw-7rem)/31)] w-[calc((100vw-7rem)/31)] max-h-12 max-w-12 text-[0.6vw]"
									/>
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export default YearGrid;
