'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GUIDE_SECTIONS, GuideSection, Article } from './helpGuideData';

interface ArticleRowProps {
  article: Article;
  isOpen: boolean;
  onToggle: () => void;
}

function ArticleRow({ article, isOpen, onToggle }: ArticleRowProps) {
  return (
    <div className='border-b border-border last:border-0'>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className='w-full flex items-center justify-between gap-4 py-3.5 text-left group'
      >
        <span className='text-sm font-semibold text-foreground group-hover:text-muted-foreground transition-colors leading-snug'>
          {article.title}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>
      <div className={cn('overflow-hidden transition-all duration-200', isOpen ? 'max-h-500 pb-4' : 'max-h-0')}>
        <p className='text-sm text-muted-foreground leading-relaxed'>
          {article.content}
        </p>
      </div>
    </div>
  );
}

export const HelpFeaturesGuide = () => {
  const [openSection, setOpenSection] = useState<string | null>('tasks');
  const [openArticle, setOpenArticle] = useState<string | null>(null);

  return (
    <section className='border-t border-border'>
      <div className='max-w-4xl mx-auto px-6 py-14'>
        <div className='mb-10'>
          <p className='text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2'>
            Feature Guides
          </p>
          <h2 className='text-2xl font-bold text-foreground'>
            In-depth documentation
          </h2>
        </div>

        <div className='space-y-3'>
          {GUIDE_SECTIONS.map((section: GuideSection) => (
            <div
              key={section.id}
              className='rounded-2xl border border-border bg-card overflow-hidden'
            >
              {/* Section header */}
              <button
                onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                className='w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-muted/50 transition-colors'
              >
                <div>
                  <p className='text-sm font-bold text-foreground'>
                    {section.title}
                  </p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    {section.articles.length} articles
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200',
                    openSection === section.id && 'rotate-180'
                  )}
                />
              </button>

              {/* Articles */}
              {openSection === section.id && (
                <div className='border-t border-border px-5'>
                  {section.articles.map((article) => {
                    const key = `${section.id}::${article.title}`;
                    return (
                      <ArticleRow
                        key={key}
                        article={article}
                        isOpen={openArticle === key}
                        onToggle={() => setOpenArticle(openArticle === key ? null : key)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
