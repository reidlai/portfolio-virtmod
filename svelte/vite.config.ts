import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "PortfolioModule",
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "svelte",
        "@modules/portfolio-ts",
        "@core/types",
        /^\$app\/.*/,
        /^\$lib\/.*/,
        /^@ui\/.*/,
      ],
      output: {
        globals: {
          svelte: "Svelte",
        },
      },
    },
  },
});
