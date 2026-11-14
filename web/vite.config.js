import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// npm run dev (inside web/) gives hot reload on :5173 and forwards API calls to the local server on :5000
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:5050", "/media": "http://localhost:5050" } },
});
