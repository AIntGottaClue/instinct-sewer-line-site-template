import { ACTIVE_CITY } from '../../city.config.mjs';
import placeholder from './cities/_placeholder.json';
import littleRockAr from './cities/little-rock-ar.json';

export interface LpVariant {
  slug: string; name: string; headline: string; subheadline: string;
  problemHeading: string; problem: string; outcome: string; outcomeCopy: string;
  detail: string; objection: string;
}
export interface CitySite {
  brand: string; brandHtml: string; origin: string;
  city: string; region: string; regionName: string; country: string; niche: string;
  phoneDisplay: string; phoneHref: string; lpPhoneDisplay: string; lpPhoneHref: string;
  ga4MeasurementId: string; airchattyTrackingId: string;
}
export interface CityData { site: CitySite; pages: Record<string, string>; lpVariants: LpVariant[]; }

const files: Record<string, CityData> = {
  '_placeholder': placeholder as CityData,
  'little-rock-ar': littleRockAr as CityData,
};
const active = files[ACTIVE_CITY];
if (!active) throw new Error(`Unknown ACTIVE_CITY "${ACTIVE_CITY}" in city.config.mjs`);
export const city: CityData = active;

// Resolves the {{TOKEN}} slots inside a page's stored HTML from the site block.
export function resolvePage(html: string): string {
  const s = city.site;
  return html.replace(/\{\{(GA4_ID|TRACKER_ID|BRAND|BRAND_HTML|PHONE_DISPLAY|PHONE_HREF|ORIGIN)\}\}/g, (_t, key) => ({
    GA4_ID: s.ga4MeasurementId, TRACKER_ID: s.airchattyTrackingId, BRAND: s.brand,
    BRAND_HTML: s.brandHtml, PHONE_DISPLAY: s.phoneDisplay, PHONE_HREF: s.phoneHref, ORIGIN: s.origin,
  }[key as string] as string));
}

// Hero-form transform: every content page gets the request form in the hero
// (LP design language) and loses the bottom contact section, so each page
// carries exactly one form. Legal pages (no hero, no form) get a hero built
// from their h1 + meta description with the home form re-labelled.
const LP_CSS = '.lp-hero .lp-hero-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(320px,.95fr);gap:54px;align-items:center;padding-top:76px;padding-bottom:76px}'
  + '.lp-hero h1{font-size:clamp(36px,4.5vw,61px);margin-bottom:23px}'
  + '.lp-form-shell{color:var(--ink);background:white;border-radius:12px;padding:26px;box-shadow:0 18px 42px #071d2290}'
  + '.lp-form-shell .form{box-shadow:none;padding:0}'
  + '.lp-form-shell .form textarea{min-height:82px}'
  + '.lp-form-shell .lead-success{color:var(--ink);border-radius:10px}.lp-form-shell .lead-success p{color:var(--muted);font-size:17px}.lp-form-shell .lead-success h2{font-size:clamp(23px,3vw,30px)}'
  + '@media(max-width:900px){.lp-hero .lp-hero-grid{grid-template-columns:1fr;gap:30px;padding-top:60px;padding-bottom:60px}}'
  + '@media(max-width:640px){.lp-hero .lp-hero-grid{padding-top:46px;padding-bottom:46px}.lp-form-shell{padding:20px}.lp-hero h1{font-size:38px}.lp-form-shell .form input,.lp-form-shell .form textarea{font-size:16px}}';

export function applyHeroForm(html: string, location: string): string {
  let out = html;
  const contactRe = /<section class="section contact" id="contact">[\s\S]*?<\/section>/;
  const contact = out.match(contactRe);
  if (contact) {
    const form = contact[0].match(/<form class="form"[\s\S]*?<\/form>/);
    if (!form) throw new Error('contact section without form');
    out = out.replace(contactRe, '');
    out = out.replace('<section class="hero"><div class="wrap"><div>', '<section class="hero lp-hero"><div class="wrap lp-hero-grid"><div class="lp-hero-copy">');
    out = out.replace(/<div aria-hidden="true" class="hero-art">[\s\S]*?<\/div><\/div><\/section>/,
      `<div class="lp-form-shell" id="contact">${form[0]}</div></div></section>`);
  } else {
    // Legal pages: build a hero from the page h1 + meta description, with the
    // home form re-labelled to this page's attribution location.
    const homeResolved = resolvePage(city.pages['/']);
    const homeForm = homeResolved.match(/<form class="form"[\s\S]*?<\/form>/);
    if (!homeForm) throw new Error('home page without form');
    const form = homeForm[0].replace(/(name="page_location"[^>]*value=")[^"]*(")/, `$1${location}$2`);
    const h1 = (out.match(/<h1>([\s\S]*?)<\/h1>/) || [null, location])[1];
    const desc = (out.match(/<meta content="([^"]*)" name="description"\/>/) || out.match(/<meta name="description" content="([^"]*)"\/>/) || [null, ''])[1];
    const hero = `<section class="hero lp-hero"><div class="wrap lp-hero-grid"><div class="lp-hero-copy"><h1>${h1}</h1><p>${desc}</p></div><div class="lp-form-shell" id="contact">${form}</div></div></section>`;
    out = out.replace('<main id="main">', `<main id="main">${hero}`);
  }
  if (!out.includes('lp-form-shell')) throw new Error(`hero form transform failed for ${location}`);
  out = out.replace('</head>', `<style>${LP_CSS}</style></head>`);
  return out;
}
