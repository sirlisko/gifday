import type { User } from "@supabase/supabase-js";
import { getDaysInYear } from "date-fns";
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

	const filled = Object.keys(dailyGifs).length;
	const total = getDaysInYear(new Date());

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentional
	useEffect(() => {
		document.title = filled > 0 ? `GifDay (${filled}/${total})` : "GifDay";
	}, [filled]);

	if (loading) return null;

	const isEmpty = filled === 0;
	const progress = (filled / total) * 100;

	return (
		<div>
			<header className="font-luckiest-guy text-center my-12">
				<h1 className="text-5xl">Have a gify day!</h1>
				<p className="font-sans font-normal text-gray-400 mt-1">your year in gifs</p>
				<div className="mx-auto mt-3 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
					<div
						className="h-full bg-gradient-to-r from-accent to-alternate rounded-full transition-all duration-500"
						style={{ width: `${progress}%` }}
					/>
				</div>
				<p className="font-sans font-normal text-xs text-gray-400 mt-1">{filled} / {total}</p>
				{user ? (
					<button
						type="button"
						onClick={() => supabase.auth.signOut()}
						className="text-xs font-sans font-normal text-gray-400 underline mt-1"
					>
						sign out
					</button>
				) : (
					<button
						type="button"
						onClick={() => setShowAuth(true)}
						className="text-xs font-sans font-normal text-gray-400 underline mt-1"
					>
						sign in to sync
					</button>
				)}
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
					onSelectedDay={(index) =>
						dailyGifs[index] ? setViewDay(index) : setSelectedDay(index)
					}
				/>
				{isEmpty && (
					<p className="text-center text-gray-400 text-sm mt-6 font-sans">
						click any day to add a gif ↑
					</p>
				)}
			</div>
			<footer className="text-center mt-8">
				<p>
					Made with ♥ by{" "}
					<a
						href="https://sirlisko.com"
						target="_blank"
						rel="noopener noreferrer"
						className="text-current font-bold"
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
						className="text-current font-bold"
					>
						GIPHY
					</a>
				</p>
			</footer>
		</div>
	);
};

export default App;
