import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    environment: "jsdom",
    exclude: ["**/node_modules/**", "**/dist/**", "**/.svelte-kit/**"],
  },
  resolve: {
    conditions: ["browser"],
    alias: {
      svelte: "svelte",
      $lib: path.resolve(__dirname, "./src/lib"),
      "@ui": path.resolve(__dirname, "./src/lib/components/ui"),
      "@modules/portfolio-ts": path.resolve(__dirname, "../ts/src"),
    },
  },
});
