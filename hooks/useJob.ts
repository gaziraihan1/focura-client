import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import type { JobPosting, JobStatus } from '@/types/job.types';
import type { AdminJobFormValues } from '@/components/AdminDashboard/careers/AdminJobForm';

// ─── Query Keys ───────────────────────────────────────────────────────────────
export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (jobId: string) => [...jobKeys.details(), jobId] as const,
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AdminJobsResponse {
  jobs: JobPosting[];
  total: number;
}

export interface UseAdminJobsOptions {
  status?: JobStatus;
  department?: string;
  page?: number;
  limit?: number;
}

// ─── Helper: Extract data from backend response ───────────────────────────────
interface BackendResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

function extractResponseData<T>(response: unknown): T {
  const res = response as BackendResponse<T> & Record<string, unknown>;
  
  if (res.success === false) {
    const error = new Error(res.message || 'Request failed') as Error & {
      code?: string;
      errors?: Record<string, string[]>;
      response?: { data: BackendResponse<T> };
    };
    error.code = res.error;
    error.errors = res.errors;
    error.response = { data: res };
    throw error;
  }
  
  if (res.data !== undefined) {
    return res.data;
  }
  
  const { ...payload } = res;
  return payload as T;
}

// ─── useAdminJobs ─────────────────────────────────────────────────────────────
export function useAdminJobs(options: UseAdminJobsOptions = {}) {
  const { status, department, page = 1, limit = 20 } = options;
  const filters = { status, department, page, limit };

  return useQuery<AdminJobsResponse, Error>({
    queryKey: jobKeys.list(filters),
    queryFn: async () => {
      const qs = new URLSearchParams();
      if (status) qs.set('status', status);
      if (department) qs.set('department', department);
      if (page) qs.set('page', String(page));
      if (limit) qs.set('limit', String(limit));
      
      const response = await api.get<AdminJobsResponse>(
        `/api/jobs/admin/all${qs.toString() ? `?${qs.toString()}` : ''}`,
        { showErrorToast: true }
      );
      
      return extractResponseData<AdminJobsResponse>(response);
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── useAdminJob (single) ─────────────────────────────────────────────────────
export function useAdminJob(jobId: string) {
  return useQuery<JobPosting, Error>({
    queryKey: jobKeys.detail(jobId),
    queryFn: async () => {
      const response = await api.get<JobPosting>(
        `/api/jobs/admin/${jobId}`,
        { showErrorToast: true }
      );
      
      const data = extractResponseData<JobPosting | null>(response);
      if (!data) {
        throw new Error('Job not found');
      }
      return data;
    },
    enabled: !!jobId,
    staleTime: 2 * 60 * 1000,
  });
}

// ─── useCreateJob ─────────────────────────────────────────────────────────────
export function useCreateJob() {
  const qc = useQueryClient();

  return useMutation<JobPosting, Error, AdminJobFormValues>({
    mutationFn: async (payload): Promise<JobPosting> => {
      const response = await api.post<JobPosting>(
        `/api/jobs/admin`,
        payload,
        { showSuccessToast: false, showErrorToast: true }
      );
      return extractResponseData<JobPosting>(response);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

// ─── useUpdateJob ─────────────────────────────────────────────────────────────
export function useUpdateJob() {
  const qc = useQueryClient();

  return useMutation<JobPosting, Error, { jobId: string; data: AdminJobFormValues }>({
    mutationFn: async ({ jobId, data }): Promise<JobPosting> => {
      const response = await api.put<JobPosting>(
        `/api/jobs/admin/${jobId}`,
        data,
        { showSuccessToast: false, showErrorToast: true }
      );
      return extractResponseData<JobPosting>(response);
    },
    onSuccess: (job) => {
      qc.setQueryData(jobKeys.detail(job.id), job);
      qc.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

// ─── useDeleteJob ─────────────────────────────────────────────────────────────
export function useDeleteJob() {
  const qc = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (jobId: string): Promise<void> => {
      await api.delete(
        `/api/jobs/admin/${jobId}`,
        { showSuccessToast: false, showErrorToast: true }
      );
    },
    onSuccess: (_, jobId) => {
      qc.removeQueries({ queryKey: jobKeys.detail(jobId) });
      qc.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

// ─── useToggleJobPin ──────────────────────────────────────────────────────────
export function useToggleJobPin() {
  const qc = useQueryClient();

  return useMutation<JobPosting, Error, string>({
    mutationFn: async (jobId: string): Promise<JobPosting> => {
      const response = await api.patch<JobPosting>(
        `/api/jobs/admin/${jobId}/pin`,
        {},
        { showSuccessToast: false, showErrorToast: true }
      );
      return extractResponseData<JobPosting>(response);
    },
    onSuccess: (job) => {
      qc.setQueryData(jobKeys.detail(job.id), job);
      qc.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}

// ─── useToggleJobStatus ───────────────────────────────────────────────────────
export function useToggleJobStatus() {
  const qc = useQueryClient();

  return useMutation<JobPosting, Error, { jobId: string; currentStatus: JobStatus }>({
    mutationFn: async ({ jobId, currentStatus }): Promise<JobPosting> => {
      const newStatus: JobStatus = currentStatus === 'OPEN' ? 'PAUSED' : 'OPEN';
      const response = await api.put<JobPosting>(
        `/api/jobs/admin/${jobId}`,
        { status: newStatus },
        { showSuccessToast: false, showErrorToast: true }
      );
      return extractResponseData<JobPosting>(response);
    },
    onSuccess: (job) => {
      qc.setQueryData(jobKeys.detail(job.id), job);
      qc.invalidateQueries({ queryKey: jobKeys.lists() });
    },
  });
}