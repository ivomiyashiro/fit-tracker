import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/server/workouts/*": path.resolve(__dirname, "./src/modules/workouts/*"),
      "@/server/auth/*": path.resolve(__dirname, "./src/modules/auth/*"),
    },
  },
});
