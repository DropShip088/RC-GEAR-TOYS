import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "/RC-GEAR-TOYS/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        policy: resolve(__dirname, "policy.html")
      }
    }
  }
});
