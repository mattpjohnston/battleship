import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/battleship/",
  test: {
    environment: "node",
    globals: true,
  },
  plugins: [tailwindcss()],
});
