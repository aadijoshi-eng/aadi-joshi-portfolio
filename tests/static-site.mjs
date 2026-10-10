import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..", "out");

export async function exportedPage(request) {
  const pathname = new URL(request.url).pathname;
  const file = resolve(root, `.${pathname}`, "index.html");
  const html = await readFile(file, "utf8");
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
