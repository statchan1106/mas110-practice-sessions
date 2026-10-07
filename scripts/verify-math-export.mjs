import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist/client');
const pages = [
  'chapter-4.html',
  ...['inner-products', 'polynomials', 'qr-decomposition', 'least-squares'].map(
    (slug) => `chapter-4/${slug}.html`,
  ),
];
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  assert(html.includes('katex-mathml'), `${page}: missing accessible math`);
  assert(!html.includes('katex-error'), `${page}: invalid math`);
}

// Imported KaTeX CSS must produce local font assets rather than unresolved
// relative URLs, which would silently fall back to the wrong font on Pages.
const files = fs
  .readdirSync(root, { recursive: true })
  .map((file) => String(file));
const css = files
  .filter((file) => file.endsWith('.css'))
  .map((file) => fs.readFileSync(path.join(root, file), 'utf8'))
  .join('\n');
const fontUrls = [...css.matchAll(/url\(([^)]*KaTeX_[^)]*\.woff2)\)/g)].map(
  (match) => match[1].replace(/["']/g, ''),
);
assert(fontUrls.length >= 3, 'KaTeX font declarations missing');
for (const url of fontUrls) {
  const file = url.split('/').at(-1);
  assert(
    files.some((asset) => path.basename(asset) === file),
    `Missing bundled math font: ${url}`,
  );
}
console.log(
  `Verified math in ${pages.length} pages and ${fontUrls.length} bundled font references.`,
);
