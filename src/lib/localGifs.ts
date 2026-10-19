import type { DailyGifs } from "../types";

const LOCAL_STORAGE_KEY = "dailyGifs";

export function readLocalGifs(): DailyGifs {
	try {
		const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch {
		localStorage.removeItem(LOCAL_STORAGE_KEY);
		return {};
	}
}

export function writeLocalGifs(gifs: DailyGifs) {
	localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gifs));
}

export function clearLocalGifs() {
	localStorage.removeItem(LOCAL_STORAGE_KEY);
}
