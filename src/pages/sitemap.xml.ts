import { city } from '../data/city';
export function GET() {
  const o = city.site.origin;
  const urls = Object.keys(city.pages).map(slug => `  <url><loc>${o}${slug === '/' ? '/' : `/${slug}/`}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
