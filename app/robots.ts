
import { MetadataRoute } from 'next';

const BASE_URL = process.env.SITE_URL || 'https://focura-client.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/admin-dashboard/', '/authentication/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
