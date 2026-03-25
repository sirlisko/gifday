import type { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import AuthModal from "./components/AuthModal";
import GifPicker from "./components/GifPicker";
import YearView from "./components/YearView";
import { loadGifs, saveGif } from "./lib/gifsDB";
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

	if (loading) return null;

	return (
		<div>
			<header className="font-luckiest-guy text-center my-12">
				<h1 className="text-5xl">Have a gify day!</h1>
				<p>Your year in gifs...</p>
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

			{selectedDay && (
				<GifPicker
					selectedDay={selectedDay}
					selectedImg={dailyGifs[selectedDay]}
					onClosePicker={(image) =>
						image ? handleSaveGif(image) : setSelectedDay(undefined)
					}
				/>
			)}

			<div className="min-h-[50vh]">
				<YearView dailyGifs={dailyGifs} onSelectedDay={setSelectedDay} />
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
