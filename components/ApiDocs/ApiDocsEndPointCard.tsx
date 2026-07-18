'use client';

import { useState } from 'react';
import { Endpoint } from '@/lib/apiData';
import { EndpointHeader, EndpointTabs, EndpointTab } from './ApiDocsEndpointCardParts';

// ─── Main component ───────────────────────────────────────────────────────────
interface ApiDocsEndpointCardProps {
  endpoint: Endpoint;
  defaultOpen?: boolean;
}

export const ApiDocsEndpointCard = ({
  endpoint,
  defaultOpen = false,
}: ApiDocsEndpointCardProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const [tab, setTab] = useState<EndpointTab>('examples');

  return (
    <div
      id={endpoint.id}
      className='rounded-2xl border border-border bg-card overflow-hidden scroll-mt-24'
    >
      <EndpointHeader endpoint={endpoint} open={open} onToggle={() => setOpen((v) => !v)} />

      {open && (
        <div className='border-t border-border'>
          <div className='px-5 pt-4 pb-3'>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              {endpoint.description}
            </p>
          </div>

          <EndpointTabs
            endpoint={endpoint}
            tab={tab}
            onTabChange={setTab}
          />
        </div>
      )}
    </div>
  );
};
