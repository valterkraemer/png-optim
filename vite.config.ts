import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [topLevelAwait(), wasm(), sveltekit()],
	worker: {
		plugins: [topLevelAwait(), wasm()],
	},
});
