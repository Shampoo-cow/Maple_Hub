import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/Maple_Hub/",        // GitHub Pages 경로
  build: {
    outDir: "docs",          // Pages 배포용 폴더
  },
  plugins: [
    react(),                 // ⭐⭐⭐ 반드시 필요
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});