import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CasketStar",
      fileName: "casket-star",
    },
    rollupOptions: {
      external: [
        "vue"
      ],
      output: {
        globals: {
          vue: "Vue"
        },
      },
    },
  },
});