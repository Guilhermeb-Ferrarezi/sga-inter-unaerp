import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// Sob /inter-unaerp por padrão; pode trocar via VITE_BASE_PATH (ex: "/" para dev)
const BASE = process.env.VITE_BASE_PATH ?? "/inter-unaerp/";

export default defineConfig({
  base: BASE,
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: "es2022",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["@tanstack/react-router", "@tanstack/react-query"],
          apollo: ["@apollo/client", "graphql"],
          motion: ["framer-motion"],
          icons: ["@phosphor-icons/react"],
        },
      },
    },
  },
});
