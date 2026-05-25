# Sprout Meditation

Mobile-first meditation timer built with Vite, React, Tailwind CSS, Zustand, and Capacitor.

## Run locally

```bash
npm ci --cache /tmp/npm-cache
npm run dev -- --host 127.0.0.1 --port 5173
```

Open `http://127.0.0.1:5173/`.

## Validate

```bash
npm run build --cache /tmp/npm-cache
SMOKE_OUT_DIR=var/smoke npm run smoke
PWA_BASE_URL=http://127.0.0.1:4173/ npm run smoke:pwa
npm audit --omit=dev --cache /tmp/npm-cache
```

The smoke test drives Chromium through the timer, pause/resume/exit, Stats, Guide, and Settings flows, then writes mobile and desktop screenshots to `SMOKE_OUT_DIR`.
The PWA smoke test checks the web manifest, installable icons, and service worker from a built preview URL.

If Chromium is not installed at the default path, set `CHROMIUM_BIN=/path/to/chromium`.
