import { getDaysInMonth } from "date-fns";
import times from "lodash.times";
import { useState } from "react";
import DayButton from "./DayButton.tsx";
import { type DayGridProps, MONTHS } from "./dayGrid.ts";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props extends DayGridProps {
	initialMonth: number;
}

// Small screens can't fit 12 × 31 legible tiles, so they get one month as a week calendar
const MonthGrid = ({
	year,
	initialMonth,
	dailyGifs,
	dayState,
	activeDay,
	onActive,
	onSelectedDay,
}: Props) => {
	const [month, setMonth] = useState(initialMonth);
	const mondayOffset = (new Date(year, month, 1).getDay() + 6) % 7;

	return (
		<div className="px-4 max-w-md mx-auto">
			<nav aria-label="Month" className="grid grid-cols-6 gap-1 mb-5">
				{MONTHS.map((name, index) => (
					<button
						key={name}
						type="button"
						aria-label={name}
						aria-pressed={index === month}
						onClick={() => setMonth(index)}
						className={[
							"py-1.5 text-xs font-semibold border-2",
							index === month
								? "bg-brand-text text-surface border-brand-text"
								: "border-transparent text-brand-text/70 hover:border-black",
						].join(" ")}
					>
						{name.slice(0, 3)}
					</button>
				))}
			</nav>

			<h2 className="font-display text-2xl mb-3">{MONTHS[month]}</h2>
			<div className="grid grid-cols-7 gap-1">
				{WEEKDAYS.map((weekday) => (
					<span
						key={weekday}
						aria-hidden="true"
						className="text-center text-[0.65rem] font-semibold text-brand-text/60 pb-1"
					>
						{weekday}
					</span>
				))}
				{mondayOffset > 0 && (
					<span style={{ gridColumn: `span ${mondayOffset}` }} />
				)}
				{times(getDaysInMonth(new Date(year, month))).map((day) => {
					const dayKey = `${day}-${month}-${year}`;
					return (
						<DayButton
							key={dayKey}
							dayKey={dayKey}
							dayNumber={day + 1}
							state={dayState(dayKey)}
							image={dailyGifs[dayKey]}
							playing={activeDay === dayKey}
							onSelect={onSelectedDay}
							onActive={onActive}
							className="aspect-square w-full text-xs"
						/>
					);
				})}
			</div>
		</div>
	);
};

export default MonthGrid;
