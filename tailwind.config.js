/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				accent: "#FF6B6B",
				alternate: "#4ECDC4",
				"gray-light": "#E0E0E0",
			},
			fontFamily: {
				"luckiest-guy": ['"Luckiest Guy"', "cursive"],
			},
		},
	},
	plugins: [],
};
