'use client';

import { useState } from 'react';
import { KeyRound, Copy, Trash2, Plus, Loader2, Shield, Calendar, BookOpen, Code, ExternalLink, AlertTriangle } from 'lucide-react';
import {
  useApiTokens,
  useCreateApiToken,
  useDeleteApiToken,
  type ApiToken,
} from '@/hooks/useApiTokens';
import { ConfirmModal } from '@/components/Shared/ConfirmModal';
import toast from 'react-hot-toast';

export function ApiTokensSettingsForm() {
  const { data: tokens = [], isLoading } = useApiTokens();
  const createToken = useCreateApiToken();
  const deleteToken = useDeleteApiToken();

  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenValue, setNewTokenValue] = useState<string | null>(null);
  const [showNewToken, setShowNewToken] = useState(false);
  const [activeTab, setActiveTab] = useState<'usage' | 'examples' | 'security'>('usage');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleCreate = async () => {
    if (!newTokenName.trim()) {
      toast.error('Token name is required');
      return;
    }

    const result = await createToken.mutateAsync({ name: newTokenName });

    if (result?.token) {
      setNewTokenValue(result.token);
      setShowNewToken(true);
      setNewTokenName('');
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setTokenToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!tokenToDelete) return;
    await deleteToken.mutateAsync(tokenToDelete.id);
    setDeleteModalOpen(false);
    setTokenToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setTokenToDelete(null);
  };

  const copyToken = () => {
    if (newTokenValue) {
      navigator.clipboard.writeText(newTokenValue);
      toast.success('Token copied to clipboard');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (isLoading) {
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
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
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={createToken.isPending || !newTokenName.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {createToken.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Create
            </button>
          </div>
        )}
      </div>

      {/* Existing Tokens */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-500/10">
            <Shield className="w-5 h-5 text-slate-600 dark:text-slate-400" />
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
              <div
                key={token.id}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  token.isActive
                    ? 'border-border hover:bg-accent/30'
                    : 'border-border/50 bg-muted/30 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    token.isActive ? 'bg-primary/10' : 'bg-muted'
                  }`}>
                    <KeyRound className={`w-5 h-5 ${
                      token.isActive ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{token.name}</p>
                      {!token.isActive && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="font-mono">{token.prefix}...</span>
                      {token.lastUsedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Last used {new Date(token.lastUsedAt).toLocaleDateString()}
                        </span>
                      )}
                      <span>Created {new Date(token.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteClick(token.id, token.name)}
                  disabled={deleteToken.isPending}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                  title="Delete token"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documentation */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">API Documentation</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Learn how to use your API tokens
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg mb-6">
          {[
            { id: 'usage' as const, label: 'Getting Started' },
            { id: 'examples' as const, label: 'Examples' },
            { id: 'security' as const, label: 'Security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'usage' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="text-sm font-medium mb-2">What are API Tokens?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                API tokens allow external applications, scripts, or services to interact with Focura
                on your behalf without sharing your password. Use them for automation, integrations,
                and custom workflows.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="text-sm font-medium mb-2">How to Use</h4>
              <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Create a token above with a descriptive name</li>
                <li>Copy the token immediately (it won&apos;t be shown again)</li>
                <li>Add it to your requests as a Bearer token</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="text-sm font-medium mb-2">Authorization Header</h4>
              <code className="block text-xs font-mono text-muted-foreground p-2 bg-background rounded border border-border">
                Authorization: Bearer foc_your_token_here
              </code>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Get Your Tasks</h4>
                <button
                  onClick={() => copyToClipboard('curl -H "Authorization: Bearer YOUR_TOKEN" https://api.focura.com/api/v1/tasks')}
                  className="text-xs text-primary hover:underline"
                >
                  Copy
                </button>
              </div>
              <code className="block text-xs font-mono text-muted-foreground p-2 bg-background rounded border border-border break-all">
                curl -H &quot;Authorization: Bearer YOUR_TOKEN&quot; https://api.focura.com/api/v1/tasks
              </code>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Create a Task</h4>
                <button
                  onClick={() => copyToClipboard(`curl -X POST -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d '{"title": "New Task", "status": "TODO"}' https://api.focura.com/api/v1/tasks`)}
                  className="text-xs text-primary hover:underline"
                >
                  Copy
                </button>
              </div>
              <code className="block text-xs font-mono text-muted-foreground p-2 bg-background rounded border border-border break-all">
                curl -X POST -H &quot;Authorization: Bearer YOUR_TOKEN&quot; -H &quot;Content-Type: application/json&quot; -d &apos;{`{"title": "New Task"}`}&apos; https://api.focura.com/api/v1/tasks
              </code>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">JavaScript (fetch)</h4>
                <button
                  onClick={() => copyToClipboard(`fetch('https://api.focura.com/api/v1/tasks', {\n  headers: {\n    'Authorization': 'Bearer YOUR_TOKEN'\n  }\n}).then(r => r.json())`)}
                  className="text-xs text-primary hover:underline"
                >
                  Copy
                </button>
              </div>
              <code className="block text-xs font-mono text-muted-foreground p-2 bg-background rounded border border-border whitespace-pre-wrap">
{`fetch('https://api.focura.com/api/v1/tasks', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
}).then(r => r.json())`}
              </code>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Python (requests)</h4>
                <button
                  onClick={() => copyToClipboard(`import requests\n\nheaders = {'Authorization': 'Bearer YOUR_TOKEN'}\nresponse = requests.get('https://api.focura.com/api/v1/tasks', headers=headers)\nprint(response.json())`)}
                  className="text-xs text-primary hover:underline"
                >
                  Copy
                </button>
              </div>
              <code className="block text-xs font-mono text-muted-foreground p-2 bg-background rounded border border-border whitespace-pre-wrap">
{`import requests

headers = {'Authorization': 'Bearer YOUR_TOKEN'}
response = requests.get(
    'https://api.focura.com/api/v1/tasks',
    headers=headers
)
print(response.json())`}
              </code>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">
                    Important Security Notice
                  </h4>
                  <p className="text-xs text-amber-600 dark:text-amber-500 leading-relaxed">
                    Your token is only shown once when created. Store it securely and never share it
                    publicly. If lost, you&apos;ll need to create a new token.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="text-sm font-medium mb-2">Security Best Practices</h4>
              <ul className="text-xs text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Store tokens in a secure location (password manager, environment variables)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Use HTTPS only - never send tokens over HTTP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Use descriptive names to track token usage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Delete tokens you no longer need</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Never commit tokens to code repositories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">✗</span>
                  <span>Never share tokens in public channels or documents</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-muted/50">
              <h4 className="text-sm font-medium mb-2">What to Do If Compromised</h4>
              <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
                <li>Delete the compromised token immediately</li>
                <li>Create a new token with a different name</li>
                <li>Update your applications with the new token</li>
                <li>Review recent account activity for unauthorized access</li>
              </ol>
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
            <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">API Endpoints</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Available endpoints for API token authentication
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { method: 'GET', path: '/api/v1/tasks', desc: 'List your tasks' },
            { method: 'POST', path: '/api/v1/tasks', desc: 'Create a new task' },
            { method: 'GET', path: '/api/v1/projects', desc: 'List your projects' },
            { method: 'GET', path: '/api/v1/workspaces', desc: 'List your workspaces' },
          ].map((endpoint, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
              <span className={`text-xs font-mono font-medium px-2 py-1 rounded ${
                endpoint.method === 'GET' ? 'bg-green-500/10 text-green-600 dark:text-green-400' :
                endpoint.method === 'POST' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                'bg-orange-500/10 text-orange-600 dark:text-orange-400'
              }`}>
                {endpoint.method}
              </span>
              <code className="text-xs font-mono text-muted-foreground">{endpoint.path}</code>
              <span className="text-xs text-muted-foreground ml-auto">{endpoint.desc}</span>
            </div>
          ))}
        </div>

        <a
          href="/api-docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 text-xs text-primary hover:underline"
        >
          View full API documentation
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete API Token"
        message={`Are you sure you want to delete "${tokenToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Token"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteToken.isPending}
      />
    </div>
  );
}
