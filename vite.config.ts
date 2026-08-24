/// <reference types="vitest/config" />
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
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		coverage: {
			// Scoped to the pure-logic modules the project actually unit-tests (state functions,
			// reducers, commands, shared utils) — UI-facing files (Steps, pages, LocalStorage,
			// hooks, history views/forms) are intentionally untested via render tests, so a
			// global threshold would either fail permanently or have to be set uselessly low.
			include: [
				'src/utils/**',
				'src/attackSheet/**',
				'src/pages/*/AttackSheet/AttackSheetStateFunctions.tsx',
				'src/pages/*/AttackSheet/AttackSheetStateReducer.tsx',
				'src/pages/*/AttackSheet/Commands/**',
				'src/pages/*/AttackSheet/*AttackModel.tsx',
				'src/pages/gloomstalker/FavoredEnemiesFormFunctions.tsx',
			],
			exclude: [
				'**/*.test.tsx',
				'**/AttackSheetCommands.tsx',
				'**/AttackSheetSteps.tsx',
				'**/I*AttackSheetCommand.tsx',
				'**/test/fixtures.*',
			],
			thresholds: {
				lines: 95,
				functions: 95,
				branches: 90,
				statements: 95,
			},
		},
	},
});
