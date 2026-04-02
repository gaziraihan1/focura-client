'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Plus, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useFeatureRequests,
  useFeatureFilters,
  useDeleteFeatureRequest,
  useIsFocuraAdmin,
} from '@/hooks/useFeatures';
import { FeatureCard }          from '@/components/Features/AllFeatures/FeatureCard';
import { FeatureRequestModal }  from '@/components/Features/AllFeatures/FeatureRequestModal';
import type { FeatureStatus }   from '@/types/feature.types';

const STATUS_TABS: { value: FeatureStatus | 'ALL'; label: string }[] = [
  { value: 'ALL',       label: 'All' },
  { value: 'APPROVED',  label: 'Open for Voting' },
  { value: 'PLANNED',   label: 'Planned' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PENDING',   label: 'Pending Review' },
  { value: 'REJECTED',  label: 'Rejected' },
];

export default function FeaturesPage() {
  const [showModal,   setShowModal]   = useState(false);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');

  const { filters, setStatus, setSearch, setPage } = useFeatureFilters();
  const { data,  isLoading  } = useFeatureRequests(filters);
  const { data: isAdmin = false } = useIsFocuraAdmin();
  const deleteFeature = useDeleteFeatureRequest();

  const handleSearch = (v: string) => {
    setSearchInput(v);
    setSearch(v);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try { await deleteFeature.mutateAsync(id); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-6 px-6 sm:px-8 lg:px-6 max-w-4xl mx-auto py-16">

      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Feature Requests</h1>
            {data?.pagination.totalCount !== undefined && (
              <span className="text-sm text-muted-foreground">({data.pagination.totalCount})</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Vote on features you&apos;d love to see, or submit your own idea.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Request Feature
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search feature requests…"
          className={cn(
            'w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card',
            'text-sm text-foreground placeholder:text-muted-foreground/50',
            'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all',
          )}
        />
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {STATUS_TABS
          .filter(({ value }) =>
            // Non-admins don't see PENDING / REJECTED tabs
            isAdmin ? true : value !== 'PENDING' && value !== 'REJECTED',
          )
          .map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                filters.status === value || (!filters.status && value === 'ALL')
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted',
              )}
            >
              {label}
            </button>
          ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : !data?.data.length ? (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Lightbulb className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">No feature requests yet</p>
          <p className="text-xs text-muted-foreground mt-1.5 max-w-55">
            Be the first to submit an idea for the community to vote on.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {data.data.map((feature, i) => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                isAdmin={isAdmin}
                isDeleting={deletingId === feature.id}
                onDelete={handleDelete}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {(data?.pagination.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Page {filters.page ?? 1} of {data!.pagination.totalPages}
            {' · '}
            <span className="font-medium text-foreground">{data!.pagination.totalCount}</span> total
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((filters.page ?? 1) - 1)}
              disabled={!data?.pagination.hasPrev}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((filters.page ?? 1) + 1)}
              disabled={!data?.pagination.hasPrev}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <FeatureRequestModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}