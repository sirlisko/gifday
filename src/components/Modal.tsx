import { type ReactElement, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
	isModalOpen?: boolean;
	onClose: () => void;
	children: ReactElement;
}

const Modal = ({ isModalOpen, onClose, children }: Props) => {
	useEffect(() => {
		if (!isModalOpen) return;
		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", handleKey);
			document.body.style.overflow = "";
		};
	}, [isModalOpen, onClose]);

	if (!isModalOpen) return null;

	return createPortal(
		// biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handled by Escape key above
		<div
			className="fixed inset-0 bg-black/60 z-10 flex items-center justify-center p-4"
			onClick={onClose}
		>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: inner click just stops propagation */}
			<div
				className="relative w-full p-8 bg-surface border-[3px] border-black shadow-[8px_8px_0_0_#000] max-w-[640px] max-h-[95vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 border-black font-black text-lg bg-surface hover:bg-primary transition-colors leading-none"
				>
					×
				</button>
				{children}
			</div>
		</div>,
		document.body,
	);
};

export default Modal;
