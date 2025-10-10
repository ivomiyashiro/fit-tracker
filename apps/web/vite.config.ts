import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
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
        "/api": {
          target: `http://localhost:${env.SERVER_PORT ?? 3030}`,
          changeOrigin: true,
        },
      },
    },
  };
});
