import { useSyncExternalStore } from "react";

// Environments without matchMedia (tests, SSR) get the fallback
export function useMediaQuery(query: string, fallback = true) {
	return useSyncExternalStore(
		(onChange) => {
			const media = window.matchMedia?.(query);
			media?.addEventListener("change", onChange);
			return () => media?.removeEventListener("change", onChange);
		},
		() => window.matchMedia?.(query).matches ?? fallback,
		() => fallback,
	);
}
