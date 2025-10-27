import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // FIX: Налаштовано ліміт розміру chunk'ів для уникнення попереджень
  build: {
    chunkSizeWarningLimit: 1000, // Збільшено ліміт до 1000 kB
    rollupOptions: {
      output: {
        manualChunks: {
          // Виділяємо великі бібліотеки в окремі chunk'и
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          charts: ['recharts'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        }
      }
    }
  }
}));
