import { useEffect } from "react";

export interface ToastMessage {
	text: string;
	action?: { label: string; onClick: () => void };
}

interface Props {
	toast?: ToastMessage;
	onDismiss: () => void;
}

const DISMISS_AFTER_MS = 6000;

const Toast = ({ toast, onDismiss }: Props) => {
	useEffect(() => {
		if (!toast) return;
		const timer = setTimeout(onDismiss, DISMISS_AFTER_MS);
		return () => clearTimeout(timer);
	}, [toast, onDismiss]);

	return (
		<output className="fixed bottom-6 inset-x-0 z-20 flex justify-center px-4 pointer-events-none">
			{toast && (
				<div className="pointer-events-auto flex items-center gap-4 bg-brand-text text-surface border-2 border-black pl-4 pr-2 py-2 text-sm font-semibold shadow-[4px_4px_0_0_#000]">
					<span>{toast.text}</span>
					{toast.action && (
						<button
							type="button"
							onClick={() => {
								toast.action?.onClick();
								onDismiss();
							}}
							className="bg-primary text-brand-text border-2 border-black px-3 py-1 font-bold"
						>
							{toast.action.label}
						</button>
					)}
				</div>
			)}
		</output>
	);
};

export default Toast;
