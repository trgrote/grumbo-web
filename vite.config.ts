import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
// https://dev.to/tilly/aliasing-in-vite-w-typescript-1lfo
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, "./src"),
			'@assets': path.resolve(__dirname, './src/assets'),
		},
	},
});
