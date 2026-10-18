import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "node:path";

/**
 * Automatically prepends the remote CDN host to asset URLs defined in *.asset.json files.
 * This keeps all heavy media (videos, full-res images) out of the repository/bundle.
 */
function lovableAssetCdnPlugin(cdnHost: string) {
  return {
    name: "lovable-asset-cdn",
    enforce: "pre" as const,
    transform(code: string, id: string) {
      if (id.endsWith(".asset.json")) {
        try {
          const json = JSON.parse(code);
          if (json && typeof json.url === "string" && json.url.startsWith("/__l5e/assets-v1/")) {
            json.url = `${cdnHost}${json.url}`;
          }
          return JSON.stringify(json);
        } catch {
          return null;
        }
      }
      return null;
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const CDN_HOST =
    env["VITE_ASSET_CDN_URL"]?.replace(/\/$/, "") ||
    "https://id-preview--7af7e689-94d0-422b-b997-3561621da9f8.lovable.app";

  return {
    plugins: [
      lovableAssetCdnPlugin(CDN_HOST),
      TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
      react(),
      tailwindcss(),
      tsconfigPaths(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 8080,
      host: "0.0.0.0",
    },
    preview: {
      port: 8080,
      host: "0.0.0.0",
    },
  };
});
