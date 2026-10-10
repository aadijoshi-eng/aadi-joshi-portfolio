import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'out');
const basePath = process.env.GITHUB_PAGES_BASE_PATH || '';
const htmlFiles = [];
async function walk(dir) {
  for (const name of await readdir(dir)) {
    const path = resolve(dir, name);
    const info = await stat(path);
    if (info.isDirectory()) await walk(path);
    else if (name.endsWith('.html')) htmlFiles.push(path);
  }
}
await walk(out);
assert.ok(htmlFiles.length >= 50, `Expected all statically generated routes, found ${htmlFiles.length} HTML files.`);

const requiredRoutes = [
  '', 'atlas', 'trends', 'findings', 'methodology', 'data', 'limitations', 'paper',
  'valuation/copart', 'corporate-autopsies/boeing',
  'carolina-business-brief/avidxchange-goes-private',
];
for (const route of requiredRoutes) {
  const file = route ? resolve(out, route, 'index.html') : resolve(out, 'index.html');
  await stat(file);
}

const urls = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/\b(?:href|src|action|poster)=(['"])(\/[^'"#?]*)\1/g)) {
    const url = match[2];
    if (url.startsWith('//')) continue;
    if (basePath) assert.ok(url === basePath || url.startsWith(`${basePath}/`), `Unprefixed Pages URL ${url} in ${file}`);
    urls.add(url);
  }
}
for (const url of urls) {
  const pathname = url.slice(basePath.length) || '/';
  const decoded = decodeURIComponent(pathname);
  let target = resolve(out, `.${decoded}`);
  if (!target.startsWith(`${out}${sep}`) && target !== out) throw new Error(`URL escapes export directory: ${url}`);
  if ((await stat(target).catch(() => null))?.isDirectory()) target = resolve(target, 'index.html');
  assert.ok(await stat(target).catch(() => null), `Broken internal URL ${url} -> ${target}`);
}

const paperPage = await readFile(resolve(out, 'paper/index.html'), 'utf8');
assert.match(paperPage, new RegExp(`${basePath}/downloads/working_paper\\.pdf`));
const dataPage = await readFile(resolve(out, 'data/index.html'), 'utf8');
assert.match(dataPage, /PDF · 24 pages/);
const atlasJson = JSON.parse(await readFile(resolve(out, 'data/atlas.json'), 'utf8'));
assert.equal(atlasJson.records.length, 1000);
assert.equal(atlasJson.records.filter((record) => record.startupRate === null).length, 5);

for (const filename of ['working_paper.pdf', 'working_paper_overleaf_import.zip']) {
  const original = await readFile(resolve(root, 'public/downloads', filename));
  const exported = await readFile(resolve(out, 'downloads', filename));
  assert.equal(createHash('sha256').update(exported).digest('hex'), createHash('sha256').update(original).digest('hex'), `${filename} changed during export`);
}
console.log(`GitHub Pages validation passed: ${htmlFiles.length} HTML files, ${urls.size} internal URLs, ${atlasJson.records.length} county-years, five missing startup cells, and current paper downloads.`);
