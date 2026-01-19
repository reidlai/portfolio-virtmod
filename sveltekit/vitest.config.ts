import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [svelte()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    alias: {
      "@ui": path.resolve(__dirname, "./src/__mocks__/ui"),
      $lib: path.resolve(__dirname, "./src/lib"),
      "$app/navigation": path.resolve(
        __dirname,
        "./src/__mocks__/navigation.ts",
      ),
    },
  },
  resolve: {
    alias: {
      "@ui": path.resolve(__dirname, "./src/lib/components/ui"),
      $lib: path.resolve(__dirname, "./src/lib"),
      "$env/static/public": path.resolve(__dirname, "./src/__mocks__/env.ts"),
    },
  },
});
