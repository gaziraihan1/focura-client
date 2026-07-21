'use client';

import { useState, useEffect } from 'react';
import { KeyRound, Copy, Trash2, Plus, Loader2, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

interface ApiToken {
  id: string;
  name: string;
  prefix: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

export function ApiTokensSettingsForm() {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenValue, setNewTokenValue] = useState<string | null>(null);
  const [showNewToken, setShowNewToken] = useState(false);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const result = await api.get<ApiToken[]>('/api/v1/user/tokens', { showErrorToast: false });
      if (result?.success && result.data) {
        setTokens(result.data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newTokenName.trim()) {
      toast.error('Token name is required');
      return;
    }
    setCreating(true);
    try {
      const result = await api.post<{ token: string; id: string }>('/api/v1/user/tokens', {
        name: newTokenName,
      });
      if (result?.success && result.data) {
        setNewTokenValue(result.data.token);
        setShowNewToken(true);
        setNewTokenName('');
        fetchTokens();
        toast.success('Token created successfully');
      }
    } catch {
      toast.error('Failed to create token');
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this token? This action cannot be undone.')) return;
    try {
      await api.delete(`/api/v1/user/tokens/${id}`);
      setTokens((prev) => prev.filter((t) => t.id !== id));
      toast.success('Token revoked');
    } catch {
      toast.error('Failed to revoke token');
    }
  };

  const copyToken = () => {
    if (newTokenValue) {
      navigator.clipboard.writeText(newTokenValue);
      toast.success('Token copied to clipboard');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* New Token */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Create New Token</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Generate a personal API token for programmatic access
            </p>
          </div>
        </div>

        {showNewToken && newTokenValue ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                Token created successfully!
              </p>
              <p className="text-xs text-green-600 dark:text-green-500 mb-3">
                Copy this token now. You won&apos;t be able to see it again.
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm font-mono break-all">
                  {newTokenValue}
                </code>
                <button
                  onClick={copyToken}
                  className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <button
              onClick={() => { setShowNewToken(false); setNewTokenValue(null); }}
              className="text-sm text-primary hover:underline"
            >
              I&apos;ve saved my token
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-muted-foreground mb-2">
                Token Name
              </label>
              <input
                type="text"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
                placeholder="e.g., CI/CD Pipeline, Personal Script"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={creating || !newTokenName.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create
            </button>
          </div>
        )}
      </div>

      {/* Existing Tokens */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-500/10">
            <KeyRound className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Active Tokens</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {tokens.length} token{tokens.length !== 1 ? 's' : ''} configured
            </p>
          </div>
        </div>

        {tokens.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No API tokens yet. Create one above to get started.
          </p>
        ) : (
          <div className="space-y-3">
            {tokens.map((token) => (
              <div key={token.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <KeyRound className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{token.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{token.prefix}...</span>
                      {token.lastUsedAt && <span>Last used {new Date(token.lastUsedAt).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRevoke(token.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
