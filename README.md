# Editable Framer mirror
This keeps the captured Framer runtime untouched, so its responsive variants, scroll effects, component state and animations continue to run. Editing is layered on top of that runtime rather than replacing it.

## Run
`npm run serve` then open http://127.0.0.1:4173/

## Edit
Open `content.json`.
- `texts`: change the `text` value. The selector points to the original Framer element.
- `images`: change `src` to another URL or local/data URL.
- `sections`: set `hidden` to true to remove a captured section without touching its animation code.
- `styles.fontFamily`: set a CSS font stack, e.g. `"Inter, sans-serif"`.
- `styles.customCSS`: add any CSS override for colors, spacing, sizes, backgrounds, etc.

The important difference from a rebuild is that the original Framer JavaScript is still responsible for breakpoints, variants and motion. `editable.js` reapplies your content after Framer/React mutations, so hydration does not restore the old text.

This is an editable compatibility layer, not recovered original Framer source. Production bundles do not contain the original component/project structure in a reversible form.
