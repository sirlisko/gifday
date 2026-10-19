import { textButton } from "../styles/buttons.ts";

interface Props {
	year: number;
	minYear: number;
	maxYear: number;
	onYearChange: (year: number) => void;
	filled: number;
	total: number;
	signedIn: boolean;
	onSignIn: () => void;
	onSignOut: () => void;
}

const yearArrow =
	"w-9 h-9 text-xl font-bold disabled:opacity-20 disabled:cursor-default enabled:hover:text-secondary";

const Header = ({
	year,
	minYear,
	maxYear,
	onYearChange,
	filled,
	total,
	signedIn,
	onSignIn,
	onSignOut,
}: Props) => (
	<header className="text-center mt-12 mb-8 px-4">
		<h1 className="font-display text-6xl uppercase text-brand-text leading-none">
			Gif<span className="bg-primary px-1">Day</span>
		</h1>
		<p className="text-sm font-medium text-brand-text/60 mt-5">
			Your year in GIFs
		</p>

		<nav
			aria-label="Year"
			className="flex items-center justify-center gap-2 mt-6"
		>
			<button
				type="button"
				onClick={() => onYearChange(year - 1)}
				disabled={year <= minYear}
				className={yearArrow}
				aria-label="Previous year"
			>
				←
			</button>
			<span className="font-display text-2xl tabular-nums">{year}</span>
			<button
				type="button"
				onClick={() => onYearChange(year + 1)}
				disabled={year >= maxYear}
				className={yearArrow}
				aria-label="Next year"
			>
				→
			</button>
		</nav>
		<div
			aria-hidden="true"
			className="mx-auto mt-3 w-56 h-2.5 bg-white border-2 border-black overflow-hidden"
		>
			<div
				className="h-full bg-primary transition-[width] duration-500 motion-reduce:transition-none"
				style={{ width: `${(filled / total) * 100}%` }}
			/>
		</div>
		<p className="text-xs font-semibold text-brand-text/60 mt-2 tabular-nums">
			{filled} of {total} days{year === maxYear && " so far"}
		</p>

		<button
			type="button"
			onClick={signedIn ? onSignOut : onSignIn}
			className={`${textButton} mt-4`}
		>
			{signedIn ? "Sign out" : "Sign in to sync across devices"}
		</button>
	</header>
);

export default Header;
