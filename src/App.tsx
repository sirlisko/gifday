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

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		document.title = filled > 0 ? `GifDay (${filled}/${total})` : "GifDay";
	}, [filled]);

	if (loading) return null;

	return (
		<div>
			<Header
				year={selectedYear}
				currentYear={currentYear}
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
					onClosePicker={(image) => {
						if (image) save(selectedDay, image);
						setSelectedDay(undefined);
					}}
				/>
			)}

			<div className="min-h-[50vh]">
				<YearView
					dailyGifs={dailyGifs}
					year={selectedYear}
					onSelectedDay={(index) =>
						dailyGifs[index] ? setViewDay(index) : setSelectedDay(index)
					}
				/>
				{filled === 0 && (
					<p className="text-center text-brand-text/40 text-sm mt-6 font-bold uppercase tracking-widest">
						click any day to add a gif ↑
					</p>
				)}
			</div>
			<Footer />
			<Toast toast={toast} onDismiss={dismissToast} />
		</div>
	);
};

export default App;
