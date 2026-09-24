# Fuel — Framer capture + React rebuild

This repo holds two separate things side by side:

1. **`mirror/`** — a captured, editable copy of the original Framer-published "Fuel" site, used as a live reference while rebuilding it.
2. **`app/`** — a from-scratch React + TypeScript + Vite rebuild of that same site, hand-coded (not generated), reproducing its layout, styling and scroll-driven animations with plain React/CSS instead of Framer's runtime.

`app/` is the actively developed project going forward. `mirror/` is kept around as ground truth for comparison — useful if sub-pages (About, Portfolio, Contact) ever need to be rebuilt or re-checked against the original.

## Run the React rebuild (`app/`)

```
cd app
npm install
npm run dev
```
Opens at **http://localhost:5173/**. This is the real project: React 18 + TypeScript, Vite, framer-motion for animation, lenis for smooth scroll, a plain CSS design-token system, and a self-hosted variable font.

Other scripts (run from inside `app/`): `npm run build` (type-checks then builds), `npm run preview` (serves the production build).

## Run the Framer mirror (`mirror/`)

```
npm run serve
```
Opens at **http://127.0.0.1:4173/**. This keeps the captured Framer runtime untouched, so its responsive variants, scroll effects, component state and animations continue to run exactly as on the original site — useful as a live reference to compare the rebuild against, pixel by pixel.

### Editing the mirror's content
Open `content.json`.
- `texts`: change the `text` value. The selector points to the original Framer element.
- `images`: change `src` to another URL or local/data URL.
- `sections`: set `hidden` to true to remove a captured section without touching its animation code.
- `styles.fontFamily`: set a CSS font stack, e.g. `"Inter, sans-serif"`.
- `styles.customCSS`: add any CSS override for colors, spacing, sizes, backgrounds, etc.

The original Framer JavaScript is still responsible for breakpoints, variants and motion here. `editable.js` reapplies your content after Framer/React mutations, so hydration does not restore the old text. This is an editable compatibility layer, not recovered original Framer source — production bundles do not contain the original component/project structure in a reversible form.
