declare global {
	interface Window {
		umami?: { track: (event: string, data?: Record<string, string>) => void };
	}
}

export type AnalyticsEvent =
	| "gif-saved"
	| "search-no-results"
	| "try-another"
	| "sign-in"
	| "undo-delete";

// Umami is absent in dev, tests and behind blockers, so tracking must never throw.
// Never pass search text, emails or IDs: a GIF diary's contents are personal.
export const track = (event: AnalyticsEvent, data?: Record<string, string>) => {
	try {
		window.umami?.track(event, data);
	} catch {}
};
