import type { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { field, primaryButton, textButton } from "../styles/buttons";
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
	const codeInput = useRef<HTMLInputElement>(null);

	// The email form unmounts on submit, so move focus to the code field instead of the page
	useEffect(() => {
		if (step === "code") codeInput.current?.focus();
	}, [step]);

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
				setError("That code didn't work. Check it and try again.");
			}
		}
		setSubmitting(false);
	};

	const errorMessage = error && (
		<p
			role="alert"
			className="text-sm font-semibold text-danger border-2 border-danger bg-danger/10 px-3 py-2"
		>
			{error}
		</p>
	);

	return (
		<Modal isModalOpen label="Sign in" onClose={onClose}>
			<div className="flex flex-col gap-6">
				<div>
					<h2 className="font-display text-3xl">Sign in</h2>
					<p className="text-sm font-medium text-brand-text/60 mt-2 max-w-sm">
						We'll email you a code. Once you're in, your GIFs are saved to your
						account and show up on every device.
					</p>
				</div>

				{step === "email" ? (
					<form onSubmit={sendCode} className="flex flex-col gap-4">
						<input
							type="email"
							aria-label="Email"
							autoComplete="email"
							required
							data-autofocus
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={field}
						/>
						{errorMessage}
						<button
							type="submit"
							disabled={submitting}
							className={primaryButton}
						>
							{submitting ? "Sending code…" : "Email me a code"}
						</button>
					</form>
				) : (
					<form onSubmit={verifyCode} className="flex flex-col gap-4">
						<p className="text-sm font-medium text-brand-text/60">
							Enter the code we sent to{" "}
							<strong className="text-brand-text">{email}</strong>.
						</p>
						<input
							type="text"
							aria-label="Sign-in code"
							inputMode="numeric"
							autoComplete="one-time-code"
							ref={codeInput}
							placeholder="8-digit code"
							value={code}
							onChange={(e) => setCode(e.target.value)}
							maxLength={8}
							className={`${field} font-bold tabular-nums tracking-[0.4em] text-center`}
						/>
						{errorMessage}
						<button
							type="submit"
							disabled={submitting}
							className={primaryButton}
						>
							{submitting ? "Signing in…" : "Sign in"}
						</button>
						<button
							type="button"
							onClick={() => {
								setStep("email");
								setCode("");
								setError(undefined);
							}}
							className={textButton}
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
