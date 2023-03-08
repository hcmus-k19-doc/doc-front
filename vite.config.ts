import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default () => {
  return defineConfig({
    plugins: [react(), viteTsconfigPaths()],
    build: {
      commonjsOptions: {
        esmExternals: true,
      },
    },
    server: {
      port: 3000,
    },
    define: {
      global: 'window',
    },
  });
};