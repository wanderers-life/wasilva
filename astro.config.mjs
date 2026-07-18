import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://wanderers-life.github.io",
  base: "/wasilva",
  integrations: [tailwind()],
  output: "static",
});
