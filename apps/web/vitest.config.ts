import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@/web": path.resolve(__dirname, "./src"),
      "@/dtos/auth": path.resolve(__dirname, "../server/src/modules/auth/dtos/*"),
      "@/dtos/exercises": path.resolve(__dirname, "../server/src/modules/exercises/dtos/*"),
      "@/dtos/sets": path.resolve(__dirname, "../server/src/modules/sets/dtos/*"),
      "@/dtos/workouts": path.resolve(__dirname, "../server/src/modules/workouts/dtos/*"),
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
