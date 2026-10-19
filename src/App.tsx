import type { User } from "@supabase/supabase-js";
import { getDayOfYear, getDaysInYear } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import AuthModal from "./components/AuthModal";
import Footer from "./components/Footer";
import GifPicker from "./components/GifPicker";
import GifView from "./components/GifView";
import Header from "./components/Header";
import Toast, { type ToastMessage } from "./components/Toast";
import YearView from "./components/YearView";
import { useDailyGifs } from "./hooks/useDailyGifs";
import type { Image } from "./types";
import { formatDayKey } from "./utils/dayKey";

const App = () => {
	const [toast, setToast] = useState<ToastMessage>();
	const dismissToast = useCallback(() => setToast(undefined), []);
	const showError = useCallback((text: string) => setToast({ text }), []);
	const { user, dailyGifs, loading, signIn, signOut, save, remove } =
		useDailyGifs(showError);
	const [selectedDay, setSelectedDay] = useState<string>();
	const [viewDay, setViewDay] = useState<string>();
	const [showAuth, setShowAuth] = useState(false);
	const currentYear = new Date().getFullYear();
	const [selectedYear, setSelectedYear] = useState(currentYear);

	const handleSignIn = async (signedInUser: User) => {
		await signIn(signedInUser);
		setShowAuth(false);
	};

	const handleDelete = (dayKey: string, image: Image) => {
		remove(dayKey);
		setToast({
			text: `Deleted the GIF for ${formatDayKey(dayKey)}`,
			action: { label: "Undo", onClick: () => save(dayKey, image) },
		});
	};

	const filled = Object.keys(dailyGifs).filter((k) =>
		k.endsWith(`-${selectedYear}`),
	).length;
	const total =
		selectedYear === currentYear
			? getDayOfYear(new Date())
			: getDaysInYear(new Date(selectedYear, 0, 1));

	// Browsing back stops at last year, or the earliest year that has GIFs
	const minYear = Math.min(
		currentYear - 1,
		...Object.keys(dailyGifs).map((k) => Number(k.split("-")[2])),
	);

	useEffect(() => {
		document.title = filled > 0 ? `GifDay (${filled}/${total})` : "GifDay";
	}, [filled, total]);

	if (loading) return null;

	return (
		<div>
			<Header
				year={selectedYear}
				minYear={minYear}
				maxYear={currentYear}
				onYearChange={setSelectedYear}
				filled={filled}
				total={total}
				signedIn={Boolean(user)}
				onSignIn={() => setShowAuth(true)}
				onSignOut={signOut}
			/>

			{showAuth && (
				<AuthModal
					onClose={() => setShowAuth(false)}
					onSuccess={handleSignIn}
				/>
			)}

			{viewDay && dailyGifs[viewDay] && (
				<GifView
					dayIndex={viewDay}
					image={dailyGifs[viewDay]}
					onClose={() => setViewDay(undefined)}
					onDelete={() => handleDelete(viewDay, dailyGifs[viewDay])}
					onReplace={(index) => {
						setViewDay(undefined);
						setSelectedDay(index);
					}}
				/>
			)}

			{selectedDay && (
				<GifPicker
					selectedDay={selectedDay}
					selectedImg={dailyGifs[selectedDay]}
					onClosePicker={(image) => {
						if (image) save(selectedDay, image);
						setSelectedDay(undefined);
					}}
				/>
			)}

			<main className="min-h-[50vh]">
				{filled === 0 && (
					<p className="text-center text-brand-text/70 text-sm font-medium mb-6 px-4">
						{selectedYear === currentYear
							? "Start with today: it's the yellow square."
							: "Pick any day to add its GIF."}
					</p>
				)}
				<YearView
					dailyGifs={dailyGifs}
					year={selectedYear}
					onSelectedDay={(index) =>
						dailyGifs[index] ? setViewDay(index) : setSelectedDay(index)
					}
				/>
			</main>
			<Footer />
			<Toast toast={toast} onDismiss={dismissToast} />
		</div>
	);
};

export default App;
