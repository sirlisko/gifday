import { type ReactElement, useEffect, useRef } from "react";

interface Props {
	isModalOpen?: boolean;
	label: string;
	onClose: () => void;
	children: ReactElement;
}

const Modal = ({ isModalOpen, label, onClose, children }: Props) => {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!isModalOpen || !dialog) return;
		const opener = document.activeElement as HTMLElement | null;
		dialog.showModal();
		// showModal focuses the first button (close); prefer the field the content asks for
		dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
		document.body.style.overflow = "hidden";
		return () => {
			dialog.close();
			document.body.style.overflow = "";
			opener?.focus();
		};
	}, [isModalOpen]);

	if (!isModalOpen) return null;

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: Escape is handled natively via onCancel
		<dialog
			ref={dialogRef}
			aria-label={label}
			onCancel={(e) => {
				e.preventDefault();
				onClose();
			}}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			className="w-full p-0 bg-surface text-brand-text border-[3px] border-black shadow-[8px_8px_0_0_#000] max-w-[640px] max-h-[95vh] backdrop:bg-black/60"
		>
			<div className="relative p-8">
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 border-black font-black text-lg bg-surface hover:bg-primary transition-colors leading-none"
				>
					×
				</button>
				{children}
			</div>
		</dialog>
	);
};

export default Modal;
