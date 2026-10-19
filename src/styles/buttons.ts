const base =
	"border-2 border-black px-6 py-3 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed";

// Only the main action in a view gets the hard shadow, so it is always the one that stands out
export const primaryButton = `${base} bg-primary shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]`;

export const secondaryButton = `${base} bg-surface hover:bg-day`;

export const textButton =
	"text-sm font-semibold underline underline-offset-4 decoration-2 text-brand-text/70 hover:text-brand-text";

export const field =
	"border-2 border-black text-lg font-medium outline-none py-2 px-3 bg-white focus:border-secondary";
