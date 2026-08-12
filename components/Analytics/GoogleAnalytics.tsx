'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  /** Whether the visitor has explicitly opted in to analytics. */
  enabled?: boolean;
}

export function GoogleAnalytics({ enabled = false }: GoogleAnalyticsProps) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // No GA until the visitor accepts the consent banner.
  if (!GA_MEASUREMENT_ID || !enabled) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}
