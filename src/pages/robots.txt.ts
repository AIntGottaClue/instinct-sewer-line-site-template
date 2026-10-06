import { city } from '../data/city';
export function GET() {
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${city.site.origin}/sitemap.xml
`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
