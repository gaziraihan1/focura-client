import { ImageResponse } from 'next/og';

export const OG_CONFIG = {
  width: 1200,
  height: 630,
};

export type OGImageProps = {
  title: string;
  description?: string;
  badge?: string;
  gradient?: 'emerald' | 'blue' | 'violet' | 'orange' | 'rose' | 'neutral';
};

const GRADIENT_COLORS: Record<string, { primary: string; secondary: string }> = {
  emerald: { primary: '#10b981', secondary: '#059669' },
  blue: { primary: '#3b82f6', secondary: '#2563eb' },
  violet: { primary: '#8b5cf6', secondary: '#7c3aed' },
  orange: { primary: '#f97316', secondary: '#ea580c' },
  rose: { primary: '#f43f5e', secondary: '#e11d48' },
  neutral: { primary: '#525252', secondary: '#404040' },
};

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

async function getFontData(url: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(url, { next: { revalidate: 86400 } });
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('font') && !contentType.includes('octet-stream')) return null;
    return response.arrayBuffer();
  } catch {
    return null;
  }
}

export async function generateOGImage({
  title,
  description,
  badge = 'Focura',
  gradient = 'emerald',
}: OGImageProps) {
  const colors = GRADIENT_COLORS[gradient] || GRADIENT_COLORS.emerald;
  const fontData = await getFontData(
    'https://fonts.gstatic.com/s/geist/v1/3595lSlLqWD49Z3e7V1EzS1n.ttf'
  );

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-200px',
            right: '-200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${hexToRgba(colors.primary, 0.15)} 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${hexToRgba(colors.secondary, 0.1)} 0%, transparent 70%)`,
          }}
        />

        {/* Top section - Logo/Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Focura Logo Mark */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            {badge}
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '900px',
          }}
        >
          <h1
            style={{
              fontSize: title.length > 60 ? '48px' : title.length > 40 ? '56px' : '64px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: '1.1',
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            {title}
          </h1>
          {description && (
            <p
              style={{
                fontSize: '24px',
                color: '#94a3b8',
                lineHeight: '1.4',
                margin: 0,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Bottom section - URL */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
            }}
          />
          <span
            style={{
              fontSize: '18px',
              color: '#64748b',
              fontFamily: 'monospace',
            }}
          >
            focura.com
          </span>
        </div>
      </div>
    ),
    {
      width: OG_CONFIG.width,
      height: OG_CONFIG.height,
      ...(fontData
        ? {
            fonts: [
              {
                name: 'Geist',
                data: fontData,
                style: 'normal',
                weight: 400,
              },
            ],
          }
        : {}),
    }
  );
}
