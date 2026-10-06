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
