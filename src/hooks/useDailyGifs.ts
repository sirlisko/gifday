import type { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { deleteGif, loadGifs, saveGif } from "../lib/gifsDB";
import {
	clearLocalGifs,
	readLocalGifs,
	writeLocalGifs,
} from "../lib/localGifs";
import { supabase } from "../lib/supabase";
import type { DailyGifs, Image } from "../types";

export function useDailyGifs() {
	const [user, setUser] = useState<User | null>(null);
	const [dailyGifs, setDailyGifs] = useState<DailyGifs>({});
	const [loading, setLoading] = useState(true);
	// Prevents onAuthStateChange SIGNED_IN from double-running when OTP flow already called signIn
	const handlingSignIn = useRef(false);

	const signIn = async (signedInUser: User) => {
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
			clearLocalGifs();
			setDailyGifs(merged);
		} catch (e) {
			console.error("Sync failed:", e);
			setDailyGifs(readLocalGifs());
		}
		setUser(signedInUser);
		handlingSignIn.current = false;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: subscribe once on mount
	useEffect(() => {
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
				// Magic link sign-in; the OTP flow calls signIn directly
				if (event === "SIGNED_IN" && session?.user && !handlingSignIn.current) {
					signIn(session.user);
				}
			},
		);
		return () => listener.subscription.unsubscribe();
	}, []);

	const save = async (dayKey: string, image: Image) => {
		const prev = dailyGifs;
		const updated = { ...dailyGifs, [dayKey]: image };
		setDailyGifs(updated);
		if (user) {
			try {
				await saveGif(user.id, dayKey, image);
			} catch {
				setDailyGifs(prev);
			}
		} else {
			writeLocalGifs(updated);
		}
	};

	const remove = async (dayKey: string) => {
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
			writeLocalGifs(updated);
		}
	};

	const signOut = () => supabase.auth.signOut();

	return { user, dailyGifs, loading, signIn, signOut, save, remove };
}
