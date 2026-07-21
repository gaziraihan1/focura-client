'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Loader2, ExternalLink, Download } from 'lucide-react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useWorkspacePlan } from '@/context/workspacePlan/WorkspacePlanContext';
import { api } from '@/lib/axios';
import toast from 'react-hot-toast';

interface BillingSettingsFormProps {
  workspaceSlug: string;
}

interface Subscription {
  planName: string;
  status: string;
  billingCycle: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  invoiceNumber: string | null;
  periodEnd: string | null;
  paidAt: string | null;
}

const PLANS = [
  { name: 'FREE', price: 0, features: ['3 projects', '5 members', '1GB storage'] },
  { name: 'PRO', price: 12, features: ['Unlimited projects', '25 members', '10GB storage', 'Priority support'] },
  { name: 'BUSINESS', price: 29, features: ['Unlimited everything', 'Advanced analytics', 'SSO', 'Custom branding'] },
];

export function BillingSettingsForm({ workspaceSlug }: BillingSettingsFormProps) {
  const { data: workspace } = useWorkspace(workspaceSlug);
  const { isFree, isPro, isBusiness } = useWorkspacePlan();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!workspace) return;
      try {
        const [subResult, invResult] = await Promise.allSettled([
          api.get<Subscription>(`/api/v1/billing/${workspace.id}/subscription`),
          api.get<Invoice[]>(`/api/v1/billing/${workspace.id}/invoices`),
        ]);
        if (subResult.status === 'fulfilled' && subResult.value?.data) {
          setSubscription(subResult.value.data);
        }
        if (invResult.status === 'fulfilled' && invResult.value?.data) {
          setInvoices(invResult.value.data);
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [workspace]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10">
            <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Current Plan</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your workspace is on the {subscription?.planName || 'FREE'} plan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = (isFree && plan.name === 'FREE') ||
              (isPro && plan.name === 'PRO') ||
              (isBusiness && plan.name === 'BUSINESS');

            return (
              <div
                key={plan.name}
                className={`p-4 rounded-xl border ${
                  isCurrent
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                    : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{plan.name}</span>
                  {isCurrent && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Current</span>
                  )}
                </div>
                <p className="text-2xl font-bold mb-3">
                  ${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <ul className="space-y-1">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground">- {f}</li>
                  ))}
                </ul>
                {!isCurrent && plan.price > 0 && (
                  <button className="w-full mt-3 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                    Upgrade
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-500/10">
            <CreditCard className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Invoices</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} on record
            </p>
          </div>
        </div>

        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No invoices yet.
          </p>
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl border border-border">
                <div>
                  <p className="text-sm font-medium">
                    {inv.invoiceNumber || inv.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {inv.periodEnd ? new Date(inv.periodEnd).toLocaleDateString() : '-'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">
                    ${((inv.amount || 0) / 100).toFixed(2)}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    inv.status === 'paid' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
