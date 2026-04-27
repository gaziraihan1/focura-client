'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import axios                    from 'axios';
import { Loader2 }              from 'lucide-react';
import type { JobListItem, JobPosting } from '@/types/job.types';
import type { CareersFiltersState } from './CareersFilters';
import {CareersFilters}           from './CareersFilters';
import {CareersJobCard}           from './CareersJobCard';
import {CareersEmpty}             from './CareersEmpty';
import {CareersApplyModal}        from './CareersApplyModal';
import {CareersJobDetailModal}    from './CareersJobDetailModal';

const EMPTY_FILTERS: CareersFiltersState = {
  search: '', department: '', locationType: '', type: '',
};

function isJobNew(publishedAt: string | null | undefined, now: number): boolean {
  if (!publishedAt) return false;
  const publishedTime = new Date(publishedAt).getTime();
  return now - publishedTime < 7 * 24 * 60 * 60 * 1000;
}

const CareersJobList = () => {
  const [jobs, setJobs]       = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [filters, setFilters] = useState<CareersFiltersState>(EMPTY_FILTERS);
  const [selectedForApply, setSelectedForApply] = useState<JobListItem | null>(null);
  const [selectedForDetail, setSelectedForDetail] = useState<JobPosting | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ✅ Fetch public job list (no auth)
  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/jobs`, // ✅ Public endpoint
        { params: { limit: 50 } }
      );
      // Handle both wrapped { success: true, jobs: [] } and unwrapped responses
      const jobsList = data.jobs || data.data?.jobs || [];
      setJobs(jobsList);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load open roles.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch SINGLE public job details by slug (no auth required)
  const fetchJobDetails = useCallback(async (slug: string) => {
    setDetailLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/jobs/${slug}` // ✅ Public endpoint (NOT /admin/)
      );
      
      // Handle response structure: { success: true,  JobPosting } OR just JobPosting
      const fullJob: JobPosting = data.data || data;
      setSelectedForDetail(fullJob);
    } catch (err) {
      console.error('Failed to fetch job details:', err);
      setError('Failed to load job details.');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const jobsWithFlags = useMemo(() => {
    const now = Date.now();
    return jobs.map(job => ({
      ...job,
      _isNew: isJobNew(job.publishedAt, now),
    }));
  }, [jobs]);

  const filtered = useMemo(() => {
    return jobsWithFlags.filter((j) => {
      if (filters.department   && j.department   !== filters.department)   return false;
      if (filters.locationType && j.locationType !== filters.locationType) return false;
      if (filters.type         && j.type         !== filters.type)         return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !j.title.toLowerCase().includes(q) &&
          !j.location.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [jobsWithFlags, filters]);

  const hasFilters = Object.values(filters).some(Boolean);

  const handleCardClick = useCallback((job: JobListItem) => {
    fetchJobDetails(job.slug); // ✅ Fetch by slug, not id
  }, [fetchJobDetails]);

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className='flex items-center justify-center py-20'>
        <Loader2 className='w-5 h-5 text-muted-foreground animate-spin' />
      </div>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className='text-center py-16'>
        <p className='text-sm text-muted-foreground mb-3'>
          {error}
        </p>
        <button
          onClick={fetchJobs}
          className='text-sm font-semibold text-foreground underline underline-offset-2'
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      {jobs.length > 0 && (
        <div className='mb-6'>
          <CareersFilters
            filters={filters}
            onChange={setFilters}
            totalCount={filtered.length}
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <CareersEmpty
          hasFilters={hasFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      ) : (
        <div className='space-y-3'>
          {filtered.map((job) => (
            <CareersJobCard
              key={job.id}
              job={job}
              isNew={job._isNew}
              onClick={handleCardClick}
              onApply={setSelectedForApply}
            />
          ))}
        </div>
      )}

      {/* Detail Loading Overlay */}
      {detailLoading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/50 dark:bg-neutral-950/60 backdrop-blur-sm'>
          <div className='rounded-2xl bg-background border border-border p-6 flex items-center gap-3'>
            <Loader2 className='w-5 h-5 text-muted-foreground animate-spin' />
            <span className='text-sm text-foreground'>Loading job details…</span>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <CareersJobDetailModal
        job={selectedForDetail}
        onClose={() => setSelectedForDetail(null)}
      />

      {/* Apply Modal */}
      <CareersApplyModal
        job={selectedForApply}
        onClose={() => setSelectedForApply(null)}
      />
    </>
  );
};

export default CareersJobList;