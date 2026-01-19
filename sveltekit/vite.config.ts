import { defineConfig } from "vite";
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    conditions: ['browser'],
    alias: {
      'svelte': 'svelte',
      '$lib': path.resolve(__dirname, './src/lib')
    }
  }
});
