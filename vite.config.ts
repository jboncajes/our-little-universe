import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" keeps every asset path relative, so the same build works at a
// root domain (Vercel) and inside a sub-folder (GitHub Pages project sites).
export default defineConfig({
  base: "./",
  plugins: [react()],
});
