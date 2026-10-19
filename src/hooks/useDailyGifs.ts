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
import { track } from "../utils/analytics";

async function syncLocalGifs(user: User): Promise<DailyGifs> {
	const local = readLocalGifs();
	const dbGifs = await loadGifs(user.id);
	await Promise.all(
		Object.entries(local).map(([dayKey, image]) =>
			saveGif(user.id, dayKey, image),
		),
	);
	clearLocalGifs();
	return { ...dbGifs, ...local };
}

export function useDailyGifs(onError: (message: string) => void) {
	const [user, setUser] = useState<User | null>(null);
	const [dailyGifs, setDailyGifs] = useState<DailyGifs>({});
	const [loading, setLoading] = useState(true);
	// Undo and rollbacks run after other updates, so they must not read a stale render's state
	const gifsRef = useRef<DailyGifs>({});
	// Prevents onAuthStateChange SIGNED_IN from double-running when OTP flow already called signIn
	const handlingSignIn = useRef(false);

	const commit = (gifs: DailyGifs) => {
		gifsRef.current = gifs;
		setDailyGifs(gifs);
	};

	const setDay = (dayKey: string, image: Image | undefined) => {
		const updated = { ...gifsRef.current };
		if (image) updated[dayKey] = image;
		else delete updated[dayKey];
		commit(updated);
		return updated;
	};

	// Local GIFs left over from a failed sync are retried on the next sign-in or page load
	const loadSignedIn = async (signedInUser: User) => {
		try {
			commit(await syncLocalGifs(signedInUser));
		} catch (e) {
			console.error("Sync failed:", e);
			commit(readLocalGifs());
			onError(
				"Couldn't load your synced GIFs. Showing the ones saved on this device.",
			);
		}
		setUser(signedInUser);
	};

	const signIn = async (signedInUser: User) => {
		handlingSignIn.current = true;
		track("sign-in");
		await loadSignedIn(signedInUser);
		handlingSignIn.current = false;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: subscribe once on mount
	useEffect(() => {
		supabase.auth.getSession().then(async ({ data }) => {
			const sessionUser = data.session?.user;
			if (sessionUser) {
				await loadSignedIn(sessionUser);
			} else {
				commit(readLocalGifs());
			}
			setLoading(false);
		});

		const { data: listener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				if (event === "SIGNED_OUT") {
					setUser(null);
					commit(readLocalGifs());
				}
				// Magic link sign-in; the OTP flow calls signIn directly
				if (event === "SIGNED_IN" && session?.user && !handlingSignIn.current) {
					signIn(session.user);
				}
			},
		);
		return () => listener.subscription.unsubscribe();
	}, []);

	const persist = async (
		dayKey: string,
		image: Image | undefined,
		failure: string,
	) => {
		const previous = gifsRef.current[dayKey];
		const updated = setDay(dayKey, image);
		if (!user) {
			writeLocalGifs(updated);
			return;
		}
		try {
			if (image) await saveGif(user.id, dayKey, image);
			else await deleteGif(user.id, dayKey);
		} catch {
			setDay(dayKey, previous);
			onError(failure);
		}
	};

	const save = (dayKey: string, image: Image) =>
		persist(dayKey, image, "Couldn't save your GIF. Try again.");

	const remove = (dayKey: string) =>
		persist(dayKey, undefined, "Couldn't delete your GIF. Try again.");

	const signOut = () => supabase.auth.signOut();

	return { user, dailyGifs, loading, signIn, signOut, save, remove };
}
