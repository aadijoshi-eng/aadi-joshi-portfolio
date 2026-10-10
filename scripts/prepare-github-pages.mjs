import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const basePath = process.env.GITHUB_PAGES_BASE_PATH || '';
if (basePath && !/^\/[A-Za-z0-9._-]+$/.test(basePath)) {
  throw new Error(`Invalid GITHUB_PAGES_BASE_PATH: ${basePath}`);
}
const out = resolve(root, 'out');
const outInfo = await stat(out).catch(() => null);
if (!outInfo?.isDirectory()) throw new Error('Next.js static export did not create out/.');

async function processHtml(directory) {
  for (const name of await readdir(directory)) {
    const path = resolve(directory, name);
    const info = await stat(path);
    if (info.isDirectory()) {
      await processHtml(path);
      continue;
    }
    if (!name.endsWith('.html')) continue;
    let html = await readFile(path, 'utf8');
    if (basePath) {
      html = html.replace(/\b(href|src|action|poster)=(['"])(\/[^'"#?]*)\2/g, (match, attr, quote, url) => {
        const rootedPath = url === basePath || url.startsWith(`${basePath}/`);
        return `${attr}=${quote}${rootedPath ? url : `${basePath}${url}`}${quote}`;
      });
    }
    await writeFile(path, html);
  }
}
await processHtml(out);
await writeFile(resolve(out, '.nojekyll'), '');
console.log(`Prepared ${out} for GitHub Pages with basePath=${basePath || '(domain root)'}`);
