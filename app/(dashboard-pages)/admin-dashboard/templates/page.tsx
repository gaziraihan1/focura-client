'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, unwrapList } from '@/lib/axios';
import { Loader2, Trash2, Mail } from 'lucide-react';

interface TemplateSubscriber {
  email: string;
}

const templateKeys = {
  all: ['templates'] as const,
};

// Data fetching goes through TanStack Query like every other page —
// this gives caching, dedup and refetch consistency for free.
const fetchSubscribers = async (): Promise<TemplateSubscriber[]> => {
  const res = await api.get<TemplateSubscriber[]>('/api/v1/templates');
  return unwrapList<TemplateSubscriber>(res);
};

const TemplatesOwnerPage = () => {
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState<string | null>(null);

  const { data: subscribers = [], isLoading: loading } = useQuery({
    queryKey: templateKeys.all,
    queryFn: fetchSubscribers,
    staleTime: 60 * 1000,
  });

  const deleteSubscriber = useMutation({
    mutationFn: async (email: string) => {
      await api.delete(`/api/v1/templates/${encodeURIComponent(email)}`, {
        showSuccessToast: true,
        showErrorToast: true,
      });
    },
    onSuccess: (_, email) => {
      // Optimistically remove from cache; invalidate keeps it honest.
      qc.setQueryData<TemplateSubscriber[]>(templateKeys.all, (old) =>
        old ? old.filter((item) => item.email !== email) : old,
      );
      void qc.invalidateQueries({ queryKey: templateKeys.all });
    },
    onSettled: () => setDeleting(null),
  });

  const handleDelete = (email: string) => {
    if (deleteSubscriber.isPending) return;
    setDeleting(email);
    deleteSubscriber.mutate(email);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Templates Waitlist
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Emails collected for template launch notification
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                No subscribers yet
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="text-right px-5 py-3 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {subscribers.map((item) => (
                  <tr
                    key={item.email}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium">
                      {item.email}
                    </td>

                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(item.email)}
                        disabled={deleting === item.email}
                        className="inline-flex items-center gap-2 text-xs font-medium text-destructive hover:opacity-80 disabled:opacity-50"
                      >
                        {deleting === item.email ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="text-xs text-muted-foreground">
          Total subscribers: <span className="font-medium text-foreground">{subscribers.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TemplatesOwnerPage;