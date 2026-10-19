// Day keys are "<zero-based day>-<zero-based month>-<year>", e.g. "0-0-2026" is January 1st
export const toDayKey = (date: Date) =>
	`${date.getDate() - 1}-${date.getMonth()}-${date.getFullYear()}`;

export const parseDayKey = (dayKey: string) => {
	const [day, month, year] = dayKey.split("-").map(Number);
	return new Date(year, month, day + 1);
};

export const formatDayKey = (dayKey: string) =>
	parseDayKey(dayKey).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
	});
