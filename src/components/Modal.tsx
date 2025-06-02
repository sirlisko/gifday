import type React from "react";
import ReactModal from "react-modal2";

ReactModal.getApplicationElement = () => document.getElementById("root");

interface Props {
	isModalOpen?: boolean;
	onClose: () => void;
	children: React.ReactElement;
}

const Modal = ({ isModalOpen, onClose, children }: Props) => {
	if (!isModalOpen) {
		return null;
	}
	return (
		<ReactModal
			backdropClassName="fixed inset-0 bg-black/70 z-10"
			modalClassName="relative w-[90%] h-[95%] m-0 p-10 bg-white rounded-md shadow-2xl max-w-[700px] top-1/2 left-1/2 text-left -translate-x-1/2 -translate-y-1/2 sm:h-auto sm:w-4/5"
			onClose={onClose}
		>
			<button
				type="button"
				onClick={onClose}
				className="fixed top-4 right-4 border-none p-0 text-2xl bg-transparent"
			>
				×
			</button>
			<div className="overflow-y-auto h-full">{children}</div>
		</ReactModal>
	);
};

export default Modal;
