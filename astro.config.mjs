import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Use /wasilva base for production (GitHub Pages), empty for dev
const base = process.env.NODE_ENV === "production" ? "/wasilva" : "/";

export default defineConfig({
  site: "https://wanderers-life.github.io",
  base,
  output: "static",
  i18n: {
    defaultLocale: "si",
    locales: ["si", "en"],
    routing: {
      prefixDefaultLocale: false, // 'si' stays on root, 'en' pages live under /en/
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
