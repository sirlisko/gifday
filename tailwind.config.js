/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#FDC800",
				secondary: "#432DD7",
				success: "#16A34A",
				warning: "#D97706",
				danger: "#DC2626",
				surface: "#FBFBF9",
				"brand-text": "#1C293C",
			},
			fontFamily: {
				sans: ['"Inter"', "system-ui", "sans-serif"],
				mono: ['"JetBrains Mono"', "monospace"],
			},
		},
	},
	plugins: [],
};
