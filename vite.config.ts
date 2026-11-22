import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { advise, providerStatus, type StyleRequest } from "./server/estilos";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, "");
  return {
    plugins: [react(), estilosApi(env)],
    resolve: {
      alias: { "@": path.resolve(root, "src") },
    },
    server: { port: 5173 },
  };
});

function estilosApi(env: Record<string, string>): Plugin {
  const handle = async (
    request: import("node:http").IncomingMessage,
    response: import("node:http").ServerResponse,
    next: (error?: unknown) => void,
  ) => {
    const url = request.url?.split("?")[0];
    if (url !== "/api/estilos") {
      next();
      return;
    }
    try {
      if (request.method === "GET") {
        send(response, 200, providerStatus(env));
        return;
      }
      if (request.method !== "POST") {
        send(response, 405, { error: "Usa POST" });
        return;
      }
      const body = (await readJson(request)) as StyleRequest;
      const advice = await advise(body, env);
      send(response, 200, advice);
    } catch {
      send(response, 400, { error: "No pudimos leer la solicitud de estilos." });
    }
  };

  return {
    name: "frameart-estilos",
    configureServer(server) {
      server.middlewares.use(handle);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle);
    },
  };
}

function send(response: import("node:http").ServerResponse, status: number, payload: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}

async function readJson(request: import("node:http").IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 2_500_000) throw new Error("grande");
    chunks.push(buffer);
  }
  if (size === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
