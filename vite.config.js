import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  plugins: [tailwindcss()],
});
