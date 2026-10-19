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
}: Props) => {
	const progress = (filled / total) * 100;

	return (
		<header className="text-center mt-12 mb-8">
			<h1 className="text-6xl font-black uppercase tracking-tight text-brand-text leading-none">
				Gif<span className="bg-primary px-1">Day</span>
			</h1>
			<p className="text-sm font-medium text-brand-text/50 mt-2 uppercase tracking-widest">
				your year in gifs
			</p>

			<div className="flex items-center justify-center gap-4 mt-4">
				<button
					type="button"
					onClick={() => onYearChange(year - 1)}
					disabled={year <= minYear}
					className="text-xl font-black disabled:opacity-20 hover:text-primary transition-colors"
					aria-label="Previous year"
				>
					←
				</button>
				<span className="font-black text-xl tabular-nums">{year}</span>
				<button
					type="button"
					onClick={() => onYearChange(year + 1)}
					disabled={year >= maxYear}
					className="text-xl font-black disabled:opacity-20 hover:text-primary transition-colors"
					aria-label="Next year"
				>
					→
				</button>
			</div>
			<div className="mx-auto mt-3 w-56 h-3 bg-white border-2 border-black overflow-hidden shadow-[3px_3px_0_0_#000]">
				<div
					className="h-full bg-primary transition-all duration-500"
					style={{ width: `${progress}%` }}
				/>
			</div>
			<p className="text-xs font-bold text-brand-text/50 mt-1 tabular-nums">
				{filled} / {total}
			</p>

			<div className="mt-3">
				{signedIn ? (
					<button
						type="button"
						onClick={onSignOut}
						className="text-xs font-bold uppercase tracking-wider border-2 border-black px-3 py-1 bg-surface hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
					>
						Sign out
					</button>
				) : (
					<button
						type="button"
						onClick={onSignIn}
						className="text-xs font-bold uppercase tracking-wider border-2 border-black px-3 py-1 bg-surface hover:bg-primary transition-colors shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
					>
						Sign in to sync
					</button>
				)}
			</div>
		</header>
	);
};

export default Header;
