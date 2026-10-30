import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	// Unusual ports so the app doesn't clash with other local projects.
	server: { port: 5847, strictPort: true },
	preview: { port: 5848, strictPort: true }
});
