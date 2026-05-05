'use client';

import { useMemo, useState } from 'react';
import { Layers } from 'lucide-react';
import { filterTemplates, CategoryFilter, TEMPLATES } from '@/lib/templatesData';
import { Template } from '@/types/templates.types';
import TemplateCard from './TemplatesCard';

interface TemplatesGridProps {
  category: CategoryFilter;
  search: string;
}

const TemplatesGrid = ({ category, search }: TemplatesGridProps) => {
  const [notifiedIds, setNotifiedIds] = useState<string[]>([]);

  const filtered = useMemo(
    () => filterTemplates(TEMPLATES, category, search),
    [category, search]
  );

  const handleNotify = (template: Template) => {
    setNotifiedIds((prev) => [...prev, template.id]);
  };

  if (filtered.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <div className='w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5'>
          <Layers className='w-6 h-6 text-neutral-400 dark:text-neutral-500' strokeWidth={1.5} />
        </div>
        <h3 className='text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2'>
          No templates found
        </h3>
        <p className='text-xs text-neutral-500 dark:text-neutral-400 max-w-xs leading-relaxed'>
          No templates match your current filters. Try a different category or search term.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <p className='text-xs text-neutral-400 dark:text-neutral-500'>
        Showing{' '}
        <span className='font-semibold text-neutral-700 dark:text-neutral-300'>
          {filtered.length}
        </span>{' '}
        {filtered.length === 1 ? 'template' : 'templates'}
      </p>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onNotify={handleNotify}
          />
        ))}
      </div>
    </div>
  );
};

export default TemplatesGrid;