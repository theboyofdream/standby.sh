# standby.sh

A clean, customizable standby clock — clocks, countdowns, and stopwatches in your browser. Inspired by iOS StandBy.

## Features
- **Clocks** — multiple timezones, 12/24h, show/hide seconds, per-clock fullscreen
- **Countdown** — multiple timers, pause/resume, single-run guard, expiry toast
- **Stopwatch** — multiple instances, lap-style start/pause/reset
- **Customization** — light/dark/system theme, font-scale (sm/md/lg/xl), seconds & hour-format toggles
- **Responsive** — desktop header + mobile bottom nav, touch-friendly, no horizontal overflow
- **Data** — local persistence (zustand), JSON export/import
- **Stack** — React 19 + Vite, react-router, zustand, shadcn/ui, Tailwind v4, sonner

## Routes
- `/` — landing (live clock + links)
- `/clocks` — manage clocks
- `/countdown` — manage countdowns
- `/stopwatch` — manage stopwatches

## Dev
```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build
pnpm lint
```
