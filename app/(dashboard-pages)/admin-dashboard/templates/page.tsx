'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Loader2, Trash2, Mail } from 'lucide-react';

interface TemplateSubscriber {
  email: string;
}

const TemplatesOwnerPage = () => {
  const [data, setData] = useState<TemplateSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    const res = await api.get<TemplateSubscriber[]>('/api/v1/templates');
    if (res?.success && res.data) return res.data;
    return [];
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      const result = await fetchSubscribers();
      if (mounted) {
        setData(result);
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const handleDelete = async (email: string) => {
    if (deleting) return;

    setDeleting(email);

    const res = await api.delete(
      `/api/v1/templates/${encodeURIComponent(email)}`,
      {
        showSuccessToast: true,
        showErrorToast: true,
      }
    );

    if (res?.success) {
      setData((prev) => prev.filter((item) => item.email !== email));
    }

    setDeleting(null);
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
          ) : data.length === 0 ? (
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
                {data.map((item) => (
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
          Total subscribers: <span className="font-medium text-foreground">{data.length}</span>
        </div>
      </div>
    </div>
  );
};

export default TemplatesOwnerPage;