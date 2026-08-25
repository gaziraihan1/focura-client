import { ApiSection } from "@/lib/apiData";
import { ApiDocsEndpointCard } from "./ApiDocsEndPointCard";

interface ApiDocsSectionProps {
  section    : ApiSection;
  firstOpen ?: boolean;
}

export const ApiDocsSection = ({ section, firstOpen = false }: ApiDocsSectionProps) => {
  return (
    <div id={section.id} className='scroll-mt-24 space-y-3'>
      {/* Section header */}
      <div className='mb-6'>
        <p className='text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1'>
          {section.endpoints.length} endpoint{section.endpoints.length !== 1 ? 's' : ''}
        </p>
        <h2 className='text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1.5'>
          {section.title}
        </h2>
        <p className='text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-2xl'>
          {section.description}
        </p>
      </div>

      {/* Endpoint cards */}
      <div className='space-y-3'>
        {section.endpoints.map((endpoint, i) => (
          <ApiDocsEndpointCard
            key={endpoint.id}
            endpoint={endpoint}
            defaultOpen={firstOpen && i === 0}
          />
        ))}
      </div>
    </div>
  );
};