import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..", "out");
const basePath = process.env.GITHUB_PAGES_BASE_PATH || "";
const port = Number(process.env.PORT || "3000");
const contentTypes = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".pdf", "application/pdf"],
  [".zip", "application/zip"],
  [".xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  [".woff2", "font/woff2"],
]);

if (!(await stat(root).catch(() => null))?.isDirectory()) {
  throw new Error("Run npm run build before starting the static server.");
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}
if (basePath && !/^\/[A-Za-z0-9._-]+$/.test(basePath)) {
  throw new Error("GITHUB_PAGES_BASE_PATH must be a single repository path.");
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  try {
    const pathname = decodeURIComponent(new URL(request.url || "/", "http://localhost").pathname);
    if (basePath && pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const relativePath = basePath ? pathname.slice(basePath.length) : pathname;
    let file = resolve(root, `.${relativePath || "/"}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(400);
      response.end("Invalid path");
      return;
    }
    const info = await stat(file).catch(() => null);
    if (info?.isDirectory()) file = resolve(file, "index.html");
    const bytes = await readFile(file);
    response.writeHead(200, {
      "Content-Type": contentTypes.get(extname(file)) || "application/octet-stream",
      "Content-Length": bytes.length,
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : bytes);
  } catch (error) {
    const notFound = error instanceof Error && "code" in error && error.code === "ENOENT";
    response.writeHead(notFound ? 404 : 400);
    response.end(notFound ? "Not found" : "Invalid request");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Portfolio available at http://127.0.0.1:${port}${basePath}/`);
});
