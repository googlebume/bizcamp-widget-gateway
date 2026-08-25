# Bizcamp Widget Gateway

Premium landing page and B2B onboarding bridge for the Bizcamp Focus widget.

## Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 + shadcn/ui primitives (Liquid Glass styled)
- Framer Motion, Lucide
- Convex backend from `../react-widget-bizcamp/convex` (orgs, domains, usage analytics)
- Live widget demo from `../react-widget-bizcamp`

## Develop

```bash
# Terminal 1 — widget Convex (auth, quiz, analytics, orgs)
cd ../react-widget-bizcamp
bun install
bun run dev:convex

# Terminal 2 — gateway UI (points at the same Convex URLs)
cd ../bizcamp-widget-gateway
bun install
# Copy VITE_CONVEX_* from the widget .env.local
bun run dev
```

Or from this repo:

```bash
bun run dev:with-backend
```

Open `http://localhost:5173`.

## Routes

- `/` — landing, benefits, live widget preview, organization registration
- `/dashboard/:organizationId` — claim domain (once), then full usage dashboard

## Widget integration

Vite aliases:

- `@bizcamp-widget` → `../react-widget-bizcamp/src`
- `@bizcamp-backend` → `../react-widget-bizcamp/convex`

The hero **Live demo** embeds `/widget-demo.html` in an iframe. That page loads the local
`/widget.js` artifact, built from `react-widget-bizcamp` via `bun run sync-widget`.

Admin **Widget** always shows the production script URL:
`https://adaptive-widget.kostapenko.com/widget.js`.
