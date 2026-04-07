import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-redux": ["@reduxjs/toolkit", "react-redux"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-axios": ["axios"],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./test/setup/setupTests.js",
    include: ["test/**/*.test.{js,jsx}"],
  },
});
