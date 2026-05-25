const baseUrl = new URL(process.env.PWA_BASE_URL ?? process.env.SMOKE_BASE_URL ?? 'http://127.0.0.1:4173/');

async function fetchOk(url, expectedType) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (expectedType && !contentType.includes(expectedType)) {
    throw new Error(`${url} returned unexpected content-type: ${contentType}`);
  }
  return response;
}

function resolveAppUrl(path) {
  return new URL(path, baseUrl);
}

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

const htmlResponse = await fetchOk(baseUrl, 'text/html');
const html = await htmlResponse.text();
requireValue(/rel=["']manifest["']/.test(html), 'HTML does not link a web manifest');

const manifestUrl = resolveAppUrl('manifest.webmanifest');
const manifestResponse = await fetchOk(manifestUrl, 'application/manifest+json');
const manifest = await manifestResponse.json();

requireValue(manifest.name === 'Sprout Meditation', 'manifest.name is missing or incorrect');
requireValue(manifest.short_name === 'Sprout', 'manifest.short_name is missing or incorrect');
requireValue(manifest.display === 'standalone', 'manifest.display must be standalone');
requireValue(manifest.start_url, 'manifest.start_url is missing');
requireValue(manifest.scope, 'manifest.scope is missing');
requireValue(manifest.theme_color === '#678e7c', 'manifest.theme_color is missing or incorrect');
requireValue(manifest.background_color === '#fbfaf9', 'manifest.background_color is missing or incorrect');
requireValue(Array.isArray(manifest.icons), 'manifest.icons must be an array');

const icons = manifest.icons;
const has192 = icons.some((icon) => icon.sizes === '192x192' && icon.type === 'image/png');
const has512 = icons.some((icon) => icon.sizes === '512x512' && icon.type === 'image/png');
const hasMaskable = icons.some((icon) => String(icon.purpose ?? '').includes('maskable'));
requireValue(has192, 'manifest is missing a 192x192 PNG icon');
requireValue(has512, 'manifest is missing a 512x512 PNG icon');
requireValue(hasMaskable, 'manifest is missing a maskable icon');

await Promise.all(
  icons.map(async (icon) => {
    requireValue(icon.src, `manifest icon is missing src: ${JSON.stringify(icon)}`);
    await fetchOk(resolveAppUrl(icon.src));
  }),
);

await fetchOk(resolveAppUrl('sw.js'), 'text/javascript');

console.log(`PWA smoke passed for ${baseUrl.href}`);
