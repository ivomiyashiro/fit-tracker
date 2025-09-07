import react from "@vitejs/plugin-react";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ["./tsconfig.app.json"],
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@/web": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setup.ts"],
    css: true,
    exclude: ["node_modules", "dist", ".idea", ".git", ".cache"],
  },
});
