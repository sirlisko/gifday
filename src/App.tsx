import type { User } from "@supabase/supabase-js";
import { getDayOfYear, getDaysInYear } from "date-fns";
import { useEffect, useRef, useState } from "react";
import AuthModal from "./components/AuthModal";
import GifPicker from "./components/GifPicker";
import GifView from "./components/GifView";
import YearView from "./components/YearView";
import { deleteGif, loadGifs, saveGif } from "./lib/gifsDB";
import { supabase } from "./lib/supabase";
import type { DailyGifs, Image } from "./types";

const LOCAL_STORAGE_KEY = "dailyGifs";

function readLocalGifs(): DailyGifs {
	try {
		const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		localStorage.removeItem(LOCAL_STORAGE_KEY);
		return {};
	}
}

const App = () => {
	const [user, setUser] = useState<User | null>(null);
	const [dailyGifs, setDailyGifs] = useState<DailyGifs>({});
	const [selectedDay, setSelectedDay] = useState<string>();
	const [viewDay, setViewDay] = useState<string>();
	const [showAuth, setShowAuth] = useState(false);
	const [loading, setLoading] = useState(true);
	const currentYear = new Date().getFullYear();
	const [selectedYear, setSelectedYear] = useState(currentYear);
	// Prevents onAuthStateChange SIGNED_IN from double-running when OTP flow already called handleSignIn
	const handlingSignIn = useRef(false);

	const handleSignIn = async (signedInUser: User) => {
		handlingSignIn.current = true;
		try {
			const local = readLocalGifs();
			const dbGifs = await loadGifs(signedInUser.id);
			const merged = { ...dbGifs, ...local };
			const localEntries = Object.entries(local);
			if (localEntries.length > 0) {
				await Promise.all(
					localEntries.map(([dayKey, image]) =>
						saveGif(signedInUser.id, dayKey, image),
					),
				);
			}
			localStorage.removeItem(LOCAL_STORAGE_KEY);
			setDailyGifs(merged);
		} catch (e) {
			console.error("Sync failed:", e);
			setDailyGifs(readLocalGifs());
		}
		setUser(signedInUser);
		setShowAuth(false);
		handlingSignIn.current = false;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Bootstrap: restore session on page load
		supabase.auth.getSession().then(({ data }) => {
			const sessionUser = data.session?.user ?? null;
			if (sessionUser) {
				loadGifs(sessionUser.id).then(setDailyGifs).catch(console.error);
			} else {
				setDailyGifs(readLocalGifs());
			}
			setUser(sessionUser);
			setLoading(false);
		});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				if (event === "SIGNED_OUT") {
					setUser(null);
					setDailyGifs(readLocalGifs());
				}
				// Handle magic link sign-in (OTP flow uses handleSignIn directly)
				if (event === "SIGNED_IN" && session?.user && !handlingSignIn.current) {
					handleSignIn(session.user);
				}
			},
		);
		return () => listener.subscription.unsubscribe();
	}, []);

	const handleSaveGif = async (image: Image) => {
		if (!selectedDay) return;
		const prev = dailyGifs;
		const updated = { ...dailyGifs, [selectedDay]: image };
		setDailyGifs(updated);
		setSelectedDay(undefined);
		if (user) {
			try {
				await saveGif(user.id, selectedDay, image);
			} catch {
				setDailyGifs(prev);
			}
		} else {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
		}
	};

	const handleDeleteGif = async (dayKey: string) => {
		const prev = dailyGifs;
		const updated = { ...dailyGifs };
		delete updated[dayKey];
		setDailyGifs(updated);
		if (user) {
			try {
				await deleteGif(user.id, dayKey);
			} catch {
				setDailyGifs(prev);
			}
		} else {
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
		}
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

	const isEmpty = filled === 0;
	const progress = (filled / total) * 100;

	return (
		<div>
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
						onClick={() => setSelectedYear((y) => y - 1)}
						className="text-xl font-black hover:text-primary transition-colors"
						aria-label="Previous year"
					>
						←
					</button>
					<span className="font-black text-xl tabular-nums">
						{selectedYear}
					</span>
					<button
						type="button"
						onClick={() => setSelectedYear((y) => y + 1)}
						disabled={selectedYear >= currentYear}
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
					{user ? (
						<button
							type="button"
							onClick={() => supabase.auth.signOut()}
							className="text-xs font-bold uppercase tracking-wider border-2 border-black px-3 py-1 bg-surface hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
						>
							Sign out
						</button>
					) : (
						<button
							type="button"
							onClick={() => setShowAuth(true)}
							className="text-xs font-bold uppercase tracking-wider border-2 border-black px-3 py-1 bg-surface hover:bg-primary transition-colors shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
						>
							Sign in to sync
						</button>
					)}
				</div>
			</header>

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
					onDelete={handleDeleteGif}
					onReplace={(index) => {
						setViewDay(undefined);
						setSelectedDay(index);
					}}
				/>
			)}

			{selectedDay && (
				<GifPicker
					selectedDay={selectedDay}
					onClosePicker={(image) =>
						image ? handleSaveGif(image) : setSelectedDay(undefined)
					}
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
				{isEmpty && (
					<p className="text-center text-brand-text/40 text-sm mt-6 font-bold uppercase tracking-widest">
						click any day to add a gif ↑
					</p>
				)}
			</div>
			<footer className="text-center mt-10 mb-8 text-xs font-medium text-brand-text/40 space-y-1">
				<p>
					Made with ♥ by{" "}
					<a
						href="https://sirlisko.com"
						target="_blank"
						rel="noopener noreferrer"
						className="font-bold text-brand-text/60 underline"
					>
						Luca Lischetti (@sirLisko)
					</a>
				</p>
				<p>
					Powered By{" "}
					<a
						href="https://giphy.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="font-bold text-brand-text/60 underline"
					>
						GIPHY
					</a>
				</p>
			</footer>
		</div>
	);
};

export default App;
