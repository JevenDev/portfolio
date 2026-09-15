import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(path) : entry.name.endsWith('.html') ? [path] : [];
  }));
  return nested.flat();
}

const config = await readJson('data/config.json');
const variants = await readJson('data/image-variants.json');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const files = await htmlFiles('dist');
assert(files.length > 1, 'Run npm run build before checking the site');

for (const file of files) {
  const html = await readFile(file, 'utf8');
  assert(/<title>[^<]+<\/title>/.test(html), `${file}: missing title`);
  for (const name of ['description', 'og:title', 'og:description', 'og:image', 'og:image:alt', 'twitter:card']) {
    const pattern = new RegExp(`<meta[^>]+(?:name|property)="${name}"[^>]+content="([^"]+)"`);
    assert(pattern.test(html), `${file}: missing ${name}`);
  }
  assert(/rel="icon"/.test(html), `${file}: missing favicon`);
  assert.equal((html.match(/data-cf-beacon=/g) || []).length, 1, `${file}: expected one analytics beacon`);
  assert(html.includes(config.email), `${file}: missing contact email`);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"#?]+)"/g)) {
    const url = decodeURIComponent(match[1]);
    const assetPath = url.endsWith('/') ? `${url}index.html` : url;
    assert((await stat(join('dist', assetPath))).isFile(), `${file}: missing ${url}`);
  }
  const schema = html.match(/<script[^>]+id="seo-schema"[^>]*>([\s\S]*?)<\/script>/);
  assert(schema, `${file}: missing structured data`);
  assert(Array.isArray(JSON.parse(schema[1])), `${file}: invalid structured data`);
}

const notFound = await readFile('dist/404.html', 'utf8');
assert(notFound.includes('Page not found'), 'Missing 404 recovery content');
assert(notFound.includes('noindex, nofollow'), '404 must not be indexed');
assert(!sitemap.includes('/404'), '404 must not be in the sitemap');
assert(!sitemap.includes('/gallery/'), 'Alias must not be in the sitemap');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
for (const url of urls) {
  assert.equal(new URL(url).origin, new URL(config.siteUrl).origin, 'Incorrect sitemap origin');
  const path = decodeURIComponent(new URL(url).pathname);
  assert((await stat(join('dist', path, 'index.html'))).isFile(), `Missing sitemap route: ${path}`);
}
const robots = await readFile('dist/robots.txt', 'utf8');
assert(robots.includes(`Sitemap: ${config.siteUrl}/sitemap.xml`), 'Incorrect robots sitemap URL');
assert((await stat(join('dist', config.defaultOgImage))).isFile(), 'Missing default Open Graph image');

let originalBytes = 0;
let displayBytes = 0;
for (const [source, display] of Object.entries(variants)) {
  assert(display.endsWith('.webp'), `Expected WebP variant: ${display}`);
  originalBytes += (await stat(join('public', source))).size;
  displayBytes += (await stat(join('dist', display))).size;
}
assert(displayBytes < originalBytes, 'Display variants must reduce total image size');
console.log(`Verified ${files.length} HTML pages, ${urls.length} sitemap URLs, and ${Object.keys(variants).length} image variants.`);
console.log(`Display images use ${((1 - displayBytes / originalBytes) * 100).toFixed(1)}% fewer bytes than originals.`);
