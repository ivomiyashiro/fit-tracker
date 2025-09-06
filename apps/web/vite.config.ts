import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
  plugins: [
    tsconfigPaths({
      projects: ["./tsconfig.app.json"],
    }),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/lib/router/routes",
      generatedRouteTree: "./src/lib/router/route-tree.gen.ts",
      routeFileIgnorePattern: ".*\\.(test|spec)\\.(ts|tsx|js|jsx)$",
    }),
    tailwindcss(),
    react(),
  ],
  resolve: {
    alias: {
      "@/web": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3030",
    },
  },
});
