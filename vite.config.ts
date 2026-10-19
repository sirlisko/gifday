/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react";
import { type Plugin, defineConfig, loadEnv } from "vite";

// Production builds only, so dev and test runs never report events
const umami = (websiteId?: string): Plugin => ({
	name: "umami",
	apply: "build",
	transformIndexHtml: () =>
		websiteId
			? [
					{
						tag: "script",
						attrs: {
							defer: true,
							src: "/stats/script.js",
							"data-website-id": websiteId,
						},
						injectTo: "body",
					},
				]
			: [],
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
	plugins: [react(), umami(loadEnv(mode, process.cwd()).VITE_UMAMI_WEBSITE_ID)],
	test: {
		include: ["src/**/*.spec.{ts,tsx}"],
		globals: true,
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
	},
}));
