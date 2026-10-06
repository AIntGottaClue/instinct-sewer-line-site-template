# instinct-sewer-line-site-template

The Little Rock sewer line site as a reusable template. All city-specific copy,
page markup, and landing-page variants live in a single data file; the layouts,
CSS/JS, and form logic are fixed. Hand-built by Instinct to Javier's spec (the
"Topeka bells and whistles" build: lp_phone, /lp ad landing variants,
neighborhood pages, single-source phone). No AI-builder origin.

Based on [little-rock-sewer-repair-pros](https://github.com/AIntGottaClue/little-rock-sewer-repair-pros)
(live at littlerocksewerline.prosapp.site). The repo preview renders the
placeholder data file so every token is visible.

## How it works

- `src/data/cities/<slug>.json` holds one city: a `site` block (brand, origin,
  city/state, niche, phone, lp_phone, GA4, airchatty tracker), `pages` (the full
  HTML document per route), and `lpVariants` (the /lp/ ad landing copy).
- Inside each page's HTML, per-site values are slot tokens resolved at build:
  `{{BRAND}}`, `{{BRAND_HTML}}`, `{{ORIGIN}}`, `{{PHONE_DISPLAY}}`,
  `{{PHONE_HREF}}`, `{{GA4_ID}}`, `{{TRACKER_ID}}`.
- The root `city.config.mjs` picks which data file builds:
  ```js
  export const ACTIVE_CITY = '_placeholder';
  ```
- Two data files ship in the repo:
  - `_placeholder.json` - token skeleton (`{Biz Name}`, `{City, ST}`, `{State}`,
    `{main service}`, `{Location One}`-`{Location Six}`, plus hint tokens in the
    landing variants). This is what the preview renders.
  - `little-rock-ar.json` - the filled Little Rock reference.
- `robots.txt` and `sitemap.xml` are generated from the data file at build.

## Spin up a new city

1. Duplicate the data file: `cp src/data/cities/little-rock-ar.json src/data/cities/tulsa-ok.json`
2. Rewrite it for that city (copy rules below). Keep the `{{...}}` slot tokens
   in the HTML; fill the `site` block and the copy.
3. Point `city.config.mjs` at it: `export const ACTIVE_CITY = 'tulsa-ok';`
4. Build and ship.

## Copy rules for new data files

- Genuinely local: real neighborhood names, real housing stock and era, real
  sewer situations. No city-name swap.
- No em dashes. Plain sentences.
- No prices, costs, or quotes anywhere.
- Never invent credentials, guarantees, or specific facts. Absolute claims need
  a real source.
- Permits: only say a permit is needed if research shows it is required.
- Inline authority links in body copy where a source backs the claim.
- Never describe what the site is for (no "lead generation" phrasing).

## Hero form (every page)

Every page carries exactly one request form, in the hero, using the same
lp-hero layout as the landing pages. The build-time transform in
src/data/city.ts (applyHeroForm) moves the form out of the old bottom contact
section into the hero and removes that section; privacy and terms get a hero
built from their h1 + meta description with the home form re-labelled. The
/lp/ hub page stays a formless variant index by design.

## Landing pages (/lp/)

Variants come from the data file's `lpVariants`. /lp/ pages are noindex. Their
call CTA uses `lpPhoneDisplay`/`lpPhoneHref` when set; when blank, CTAs jump to
the on-page form. The form is extracted from the homepage HTML at build, so
form changes live in one place.

## Build

```bash
npm install
npm run build    # static site in dist/
npm run preview
```

GitHub Pages preview deploys on pushes to `main` (`.github/workflows/preview.yml`
derives the base path from the repo name and marks nothing indexable; /lp/ is
noindex by design).

## Structure

```
city.config.mjs              <- the one per-city edit
src/data/cities/*.json       <- all city copy + markup (one file per city)
src/data/city.ts             <- data loading + {{TOKEN}} resolution
src/layouts/LegacyPage.astro <- renders a page's preserved HTML
src/pages/lp/[...slug].astro <- landing page layout (copy from lpVariants)
src/pages/robots.txt.ts      <- generated from data
src/pages/sitemap.xml.ts     <- generated from data
public/assets/site.css|js    <- shared design assets
```
