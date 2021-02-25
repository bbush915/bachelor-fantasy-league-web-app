import vue from "@vitejs/plugin-vue";
import path from "path";
import { defineConfig } from "vite";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    {
      name: "fix-apollo-composable",
      enforce: "post",
      transform(src, id) {
        if (id.includes("@vue/apollo-composable/dist/useQuery.js")) {
          return {
            code: src
              .replace(/onServerPrefetch,/, "")
              .replace(/\:\sonServerPrefetch\(/, ": (")
              .replace(/onServerPrefetch/, "null")
              .replace(/(.* require\("vue"\);)/m, ""),
            id,
          };
        }
      },
    },
  ],
  optimizeDeps: {
    exclude: ["@vue/apollo-composable"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
