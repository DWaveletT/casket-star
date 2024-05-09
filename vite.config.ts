import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

import viteCompression from 'vite-plugin-compression';
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    vue(),
    visualizer({ open: true }),
    viteCompression({
      verbose: true,
      disable: false, 
      deleteOriginFile: false,
      filter: /.(js|css|cjs|mjs|json|html)$/,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    })
  ],
  resolve: {
    alias: [
      {
        find: '~',
        replacement: resolve(__dirname, 'src'),
      }
    ]
  },
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