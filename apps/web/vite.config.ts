import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "../server/dist/public",
    emptyOutDir: true,
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    react(),
  ],
  server: {
    proxy: {
      "/api": "http://localhost:3030",
    },
  },
});
