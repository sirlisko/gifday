import type { User } from "@supabase/supabase-js";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import Modal from "./Modal";

interface Props {
	onClose: () => void;
	onSuccess: (user: User) => void;
}

const AuthModal = ({ onClose, onSuccess }: Props) => {
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [step, setStep] = useState<"email" | "code">("email");
	const [error, setError] = useState<string>();
	const [submitting, setSubmitting] = useState(false);

	const sendCode = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError(undefined);
		const { error } = await supabase.auth.signInWithOtp({
			email,
			options: { shouldCreateUser: true },
		});
		if (error) {
			setError(error.message);
		} else {
			setStep("code");
		}
		setSubmitting(false);
	};

	const verifyCode = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		setError(undefined);
		const { data, error } = await supabase.auth.verifyOtp({
			email,
			token: code,
			type: "email",
		});
		if (error) {
			setError(error.message);
		} else {
			const user = data.user ?? data.session?.user;
			if (user) {
				onSuccess(user);
			} else {
				setError("Sign in failed, please try again.");
			}
		}
		setSubmitting(false);
	};

	return (
		<Modal isModalOpen onClose={onClose}>
			<div className="flex flex-col gap-6 pt-4">
				<h2 className="text-3xl font-black uppercase tracking-tight">
					Sign In
				</h2>

				{step === "email" ? (
					<form onSubmit={sendCode} className="flex flex-col gap-4">
						<input
							type="email"
							placeholder="your@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="border-2 border-black text-lg font-medium outline-none py-2 px-3 bg-white focus:border-primary transition-colors shadow-[2px_2px_0_0_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]"
						/>
						{error && (
							<p className="text-sm font-bold text-danger border-2 border-danger bg-danger/10 px-3 py-2">
								{error}
							</p>
						)}
						<button
							type="submit"
							disabled={submitting}
							className="border-2 border-black py-3 px-8 font-black uppercase tracking-widest bg-primary shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? "Sending..." : "Send Code"}
						</button>
					</form>
				) : (
					<form onSubmit={verifyCode} className="flex flex-col gap-4">
						<p className="text-sm font-medium text-brand-text/50">
							We sent a code to{" "}
							<strong className="text-brand-text">{email}</strong>
						</p>
						<input
							type="text"
							placeholder="8-digit code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							maxLength={8}
							className="border-2 border-black text-lg font-mono font-bold tracking-[0.4em] text-center outline-none py-2 px-3 bg-white focus:border-primary transition-colors shadow-[2px_2px_0_0_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px]"
						/>
						{error && (
							<p className="text-sm font-bold text-danger border-2 border-danger bg-danger/10 px-3 py-2">
								{error}
							</p>
						)}
						<button
							type="submit"
							disabled={submitting}
							className="border-2 border-black py-3 px-8 font-black uppercase tracking-widest bg-primary shadow-[3px_3px_0_0_#000] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{submitting ? "Verifying..." : "Verify"}
						</button>
						<button
							type="button"
							onClick={() => {
								setStep("email");
								setCode("");
								setError(undefined);
							}}
							className="text-sm font-bold text-brand-text/40 hover:text-brand-text transition-colors underline"
						>
							Use a different email
						</button>
					</form>
				)}
			</div>
		</Modal>
	);
};

export default AuthModal;
