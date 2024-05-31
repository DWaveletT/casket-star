import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

import pkg from './package.json';

import viteCompression from 'vite-plugin-compression';
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    vue(),
    visualizer(),
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
    minify: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CasketStar",
      fileName: "casket-star",
    },
    rollupOptions: {
      external: (id: unknown) => [
          'vue',
          ...Object.keys(pkg.dependencies)
      ].some(s => id === s),
      output: {
        globals: {
          vue: "Vue"
        },
      },
    },
  },
  server: {
      open: '/dev/'
  }
});