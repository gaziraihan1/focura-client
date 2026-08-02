import { ImageResponse } from 'next/og';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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

/** Brand accents used for soft glows + small highlights (light theme). */
const ACCENT_COLORS: Record<string, { primary: string; secondary: string }> = {
  emerald: { primary: '#10b981', secondary: '#059669' },
  blue: { primary: '#3b82f6', secondary: '#2563eb' },
  violet: { primary: '#8b5cf6', secondary: '#7c3aed' },
  orange: { primary: '#f97316', secondary: '#ea580c' },
  rose: { primary: '#f43f5e', secondary: '#e11d48' },
  neutral: { primary: '#525252', secondary: '#404040' },
};

let cachedLogo: string | null | undefined;

/** Reads lib/assets/focura.png (bundled with the serverless function) and returns it as a base64 data URI (cached). */
function getFocuraLogo(): string | null {
  if (cachedLogo !== undefined) return cachedLogo;
  try {
    const buffer = readFileSync(join(process.cwd(), 'lib', 'assets', 'focura.png'));
    cachedLogo = `data:image/png;base64,${buffer.toString('base64')}`;
  } catch {
    cachedLogo = null;
  }
  return cachedLogo;
}

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

const GEIST_FONT_URLS: Array<{ weight: 400 | 600 | 700; url: string }> = [
  {
    weight: 400,
    url: 'https://fonts.gstatic.com/s/geist/v5/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOM4nQ.ttf',
  },
  {
    weight: 600,
    url: 'https://fonts.gstatic.com/s/geist/v5/gyBhhwUxId8gMGYQMKR3pzfaWI_RQuQ4nQ.ttf',
  },
  {
    weight: 700,
    url: 'https://fonts.gstatic.com/s/geist/v5/gyBhhwUxId8gMGYQMKR3pzfaWI_Re-Q4nQ.ttf',
  },
];

export async function generateOGImage({
  title,
  description,
  badge = 'Focura',
  gradient = 'emerald',
}: OGImageProps) {
  const accent = ACCENT_COLORS[gradient] || ACCENT_COLORS.emerald;
  // Fetch each Geist weight in parallel; register only the ones that load.
  const loadedFonts = (
    await Promise.all(
      GEIST_FONT_URLS.map(async ({ weight, url }) => {
        const data = await getFontData(url);
        return data ? { name: 'Geist', data, style: 'normal' as const, weight } : null;
      })
    )
  ).filter((f): f is NonNullable<typeof f> => f !== null);
  const logo = getFocuraLogo();

  const TITLE_FONT =
    title.length > 60 ? '46px' : title.length > 40 ? '52px' : '58px';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '56px 64px',
          background: '#fafafa',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Soft brand glows */}
        <div
          style={{
            position: 'absolute',
            top: '-220px',
            right: '-160px',
            width: '620px',
            height: '620px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${hexToRgba(accent.primary, 0.14)} 0%, transparent 70%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-260px',
            left: '-180px',
            width: '560px',
            height: '560px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${hexToRgba(accent.secondary, 0.1)} 0%, transparent 70%)`,
          }}
        />

        {/* ── Left column: brand + copy ─────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '22px',
            width: '52%',
            minWidth: '520px',
            position: 'relative',
          }}
        >
          {/* Logo + wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {logo ? (
              <img src={logo} width={52} height={52} style={{ objectFit: 'contain' }} alt="Focura logo" />
            ) : (
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${accent.primary} 0%, ${accent.secondary} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            <span
              style={{
                fontSize: '26px',
                fontWeight: 'bold',
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              {badge}
            </span>
          </div>

          {/* Eyebrow pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '999px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '8px 16px',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: accent.primary,
              }}
            />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#475569' }}>
              Focus Smarter
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: TITLE_FONT,
              fontWeight: 'bold',
              color: '#0f172a',
              lineHeight: '1.08',
              letterSpacing: '-0.035em',
              margin: 0,
            }}
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p
              style={{
                fontSize: '22px',
                color: '#64748b',
                lineHeight: '1.45',
                margin: 0,
              }}
            >
              {description}
            </p>
          )}

          {/* Stat strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginTop: '4px' }}>
            {['8,000+ focused teams', '99.9% uptime', '4.9/5 from users'].map((stat, i) => (
              <div key={stat} style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                {i > 0 && (
                  <div style={{ width: '1px', height: '18px', background: '#e2e8f0' }} />
                )}
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column: dashboard preview ───────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48%',
            position: 'relative',
          }}
        >
          {/* Browser card */}
          <div
            style={{
              width: '500px',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '18px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 32px 64px -24px rgba(15, 23, 42, 0.28)',
              overflow: 'hidden',
            }}
          >
            {/* Window chrome */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            >
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f87171' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fbbf24' }} />
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#34d399' }} />
              <div
                style={{
                  marginLeft: '12px',
                  flex: 1,
                  borderRadius: '7px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  padding: '4px 12px',
                  fontSize: '11px',
                  color: '#64748b',
                }}
              >
                app.focura.com/dashboard
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', minHeight: '330px' }}>
              {/* Mini sidebar */}
              <div
                style={{
                  width: '112px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: '1px solid #e2e8f0',
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    paddingBottom: '12px',
                    marginBottom: '8px',
                    borderBottom: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '6px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '9px',
                      fontWeight: 'bold',
                    }}
                  >
                    F
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>
                    Focura
                  </span>
                </div>

                {[
                  { label: 'Dashboard', active: true, badge: null },
                  { label: 'Tasks', active: false, badge: '12' },
                  { label: 'Projects', active: false, badge: null },
                  { label: 'Calendar', active: false, badge: null },
                  { label: 'Wellness', active: false, badge: null },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: '7px',
                      padding: '6px 8px',
                      marginBottom: '2px',
                      backgroundColor: item.active ? '#0f172a' : 'transparent',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: item.active ? 600 : 500,
                        color: item.active ? '#ffffff' : '#64748b',
                      }}
                    >
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        style={{
                          borderRadius: '999px',
                          backgroundColor: item.active ? '#ffffff' : '#e2e8f0',
                          color: item.active ? '#0f172a' : '#64748b',
                          fontSize: '8px',
                          fontWeight: 'bold',
                          lineHeight: '1',
                          padding: '2px 5px',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Main panel */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '14px',
                  gap: '12px',
                }}
              >
                {/* Greeting row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#e2e8f0',
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 'bold',
                      }}
                    >
                      A
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                      Good morning, Alex
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      borderRadius: '999px',
                      backgroundColor: '#ecfdf5',
                      padding: '3px 9px',
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent.primary }} />
                    <span style={{ fontSize: '9px', fontWeight: 600, color: '#059669' }}>
                      3 day streak
                    </span>
                  </div>
                </div>

                {/* Kanban columns */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', flex: 1 }}>
                  {[
                    {
                      name: 'Planned',
                      count: 2,
                      dot: '#94a3b8',
                      tasks: [
                        { title: 'Design system audit', tag: 'Design', tagBg: '#eff6ff', tagColor: '#2563eb', due: 'Mar 2' },
                        { title: 'API rate limiting', tag: 'Backend', tagBg: '#f5f3ff', tagColor: '#7c3aed', due: 'Today' },
                      ],
                    },
                    {
                      name: 'In progress',
                      count: 2,
                      dot: '#2563eb',
                      tasks: [
                        { title: 'Mobile nav refactor', tag: 'Mobile', tagBg: '#ecfdf5', tagColor: '#059669', due: 'Mar 5' },
                        { title: 'Onboarding flow v2', tag: 'Product', tagBg: '#fdf2f8', tagColor: '#db2777', due: 'Mar 8' },
                      ],
                    },
                    {
                      name: 'Done',
                      count: 1,
                      dot: '#10b981',
                      tasks: [
                        { title: 'Search UX polish', tag: 'UX', tagBg: '#ecfeff', tagColor: '#0891b2', due: 'Done' },
                      ],
                    },
                  ].map((col) => (
                    <div
                      key={col.name}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '10px',
                        backgroundColor: '#f8fafc',
                        padding: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          marginBottom: '7px',
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: col.dot }} />
                        <span style={{ fontSize: '8px', fontWeight: 600, color: '#64748b', letterSpacing: '0.02em' }}>
                          {col.name.toUpperCase()}
                        </span>
                        <span
                          style={{
                            borderRadius: '999px',
                            backgroundColor: '#e2e8f0',
                            color: '#64748b',
                            fontSize: '7px',
                            fontWeight: 'bold',
                            padding: '1px 5px',
                          }}
                        >
                          {col.count}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {col.tasks.map((t) => (
                          <div
                            key={t.title}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                              borderRadius: '8px',
                              border: '1px solid #e2e8f0',
                              backgroundColor: '#ffffff',
                              padding: '7px 8px',
                            }}
                          >
                            <span style={{ fontSize: '8.5px', fontWeight: 600, color: '#0f172a' }}>
                              {t.title}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span
                                style={{
                                  borderRadius: '999px',
                                  backgroundColor: t.tagBg,
                                  color: t.tagColor,
                                  fontSize: '6.5px',
                                  fontWeight: 600,
                                  padding: '2px 6px',
                                }}
                              >
                                {t.tag}
                              </span>
                              <span style={{ fontSize: '7px', color: '#94a3b8' }}>
                                {t.due === 'Done' ? 'Done' : `Due ${t.due}`}
                              </span>
                            </div>
                          </div>
                        ))}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            borderRadius: '7px',
                            border: '1px dashed #cbd5e1',
                            padding: '5px 7px',
                          }}
                        >
                          <span style={{ fontSize: '8px', color: '#94a3b8' }}>+ Add task</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating focus-streak card (overlap for depth) */}
          <div
            style={{
              position: 'absolute',
              left: '-38px',
              bottom: '34px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '190px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '12px 14px',
              boxShadow: '0 20px 40px -16px rgba(15, 23, 42, 0.3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '8px',
                  background: `linear-gradient(135deg, ${accent.primary} 0%, ${accent.secondary} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" fill="white" />
                </svg>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>
                  Focus streak
                </span>
                <span style={{ fontSize: '8px', color: '#64748b' }}>
                  Keep it going
                </span>
              </div>
            </div>
            <div
              style={{
                height: '6px',
                width: '100%',
                display: 'flex',
                borderRadius: '999px',
                backgroundColor: '#f1f5f9',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: '42%',
                  borderRadius: '999px',
                  background: accent.primary,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom-left URL */}
        <div
          style={{
            position: 'absolute',
            left: '64px',
            bottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: accent.primary,
            }}
          />
          <span style={{ fontSize: '15px', color: '#64748b', fontFamily: 'monospace' }}>
            focura-client.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: OG_CONFIG.width,
      height: OG_CONFIG.height,
      ...(loadedFonts.length > 0 ? { fonts: loadedFonts } : {}),
    }
  );
}
