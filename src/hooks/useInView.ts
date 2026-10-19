import { useEffect, useState } from "react";

const listeners = new Map<Element, (inView: boolean) => void>();
let observer: IntersectionObserver | undefined;

// One observer for every tile: a year can hold 366 of them
function getObserver() {
	observer ??= new IntersectionObserver((entries) => {
		for (const entry of entries) {
			listeners.get(entry.target)?.(entry.isIntersecting);
		}
	});
	return observer;
}

// Environments without IntersectionObserver (tests, SSR) report false
export function useInView(element: Element | null) {
	const [inView, setInView] = useState(false);

	useEffect(() => {
		if (!element || typeof IntersectionObserver === "undefined") return;
		listeners.set(element, setInView);
		getObserver().observe(element);
		return () => {
			listeners.delete(element);
			getObserver().unobserve(element);
			setInView(false);
		};
	}, [element]);

	return inView;
}
