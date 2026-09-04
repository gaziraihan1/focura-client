import { ImageResponse } from 'next/og';
import { generateOGImage } from '@/lib/og-image';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return generateOGImage({
    title: 'Careers at Gablura',
    description: 'Join us in building the future of focused work.',
    gradient: 'emerald',
  });
}
