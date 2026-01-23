import { defineConfig } from "vitest/config";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,ts}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/.svelte-kit/**"],
    alias: {
      $lib: path.resolve(__dirname, "./src/lib"),
    },
    deps: {
      optimizer: {
        web: {
          include: ["html-encoding-sniffer", "@exodus/bytes", "jsdom"],
        },
      },
    },
    server: {
      deps: {
        inline: ["jsdom", "html-encoding-sniffer", "@exodus/bytes"],
      },
    },
    pool: "forks",
  },
  ssr: {
    noExternal: ["html-encoding-sniffer", "@exodus/bytes", "jsdom"],
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
