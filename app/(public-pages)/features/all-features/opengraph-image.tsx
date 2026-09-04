import { ImageResponse } from 'next/og';
import { generateOGImage } from '@/lib/og-image';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return generateOGImage({
    title: 'Feature Requests',
    description: 'Vote on features and help shape the future of Gablura.',
    gradient: 'violet',
  });
}
