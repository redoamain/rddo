// @ts-check

import tailwindcss from '@tailwindcss/vite';
import { loadEnv } from 'vite';
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';

// astro.config runs before Astro's own env loading — read the same
// PUBLIC_ vars via Vite's loadEnv so pages & config stay in sync.
const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
	process.env.NODE_ENV ?? 'development',
	process.cwd(),
	'',
);

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		sanity({
			projectId: PUBLIC_SANITY_PROJECT_ID,
			dataset: PUBLIC_SANITY_DATASET,
			useCdn: false, // False for static builds
			apiVersion: '2024-01-01',
		}),
	],
});
