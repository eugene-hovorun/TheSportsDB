import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  build: {
    outDir: "src/public",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        events: "src/client/main.ts",
        style: "src/client/style.css",
      },
      output: {
        entryFileNames: (chunk) =>
          chunk.name === "events" ? "js/events.js" : "[name].js",
        chunkFileNames: "js/[name].js",
        assetFileNames: (info) =>
          info.name?.endsWith(".css") ? "css/app.css" : "assets/[name].[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
