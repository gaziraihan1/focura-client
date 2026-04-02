'use client';

import { CreditCard }          from 'lucide-react';
import { format } from 'date-fns';
import { useAdminBilling, useAdminPagination } from '@/hooks/useAdmin';
import { AdminTable }          from '@/components/AdminDashboard/AdminTable';
import { AdminPageHeader }     from '@/components/AdminDashboard/AdminPageHeader';
import { Pagination }          from '@/components/Shared/Pagination';
import { cn }                  from '@/lib/utils';
import type { AdminBilling }   from '@/types/admin.types';
import Link from 'next/link';

const STATUS_COLORS: Record<string, string> = {
  ACTIVE:    'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  PAST_DUE:  'text-destructive bg-destructive/10 border-destructive/20',
  CANCELED:  'text-muted-foreground bg-muted border-border',
  TRIALING:  'text-primary bg-primary/10 border-primary/20',
  PAUSED:    'text-amber-600 bg-amber-500/10 border-amber-500/20',
};

export default function AdminBillingPage() {
  const { page, setPage, search, handleSearch, pageSize } = useAdminPagination();
  const { data, isLoading } = useAdminBilling({ page, search, pageSize });

  const columns = [
    {
      key: 'workspace',
      header: 'Workspace',
      render: (b: AdminBilling) => (
        <div>
          <Link
            href={`/admin/workspaces/${b.workspace.slug}`}
            className="text-xs font-semibold text-foreground hover:text-primary transition-colors"
          >
            {b.workspace.name}
          </Link>
          <p className="text-[10px] text-muted-foreground">{b.workspace.owner.email}</p>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (b: AdminBilling) => (
        <div>
          <p className="text-xs font-semibold text-foreground">{b.plan.displayName}</p>
          <p className="text-[10px] text-muted-foreground">{b.billingCycle}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (b: AdminBilling) => (
        <div className="space-y-1">
          <span className={cn(
            'text-[10px] px-2 py-0.5 rounded-full border font-semibold uppercase',
            STATUS_COLORS[b.status] ?? STATUS_COLORS['CANCELED'],
          )}>
            {b.status}
          </span>
          {b.cancelAtPeriodEnd && (
            <p className="text-[10px] text-destructive">Cancels at period end</p>
          )}
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price / mo',
      render: (b: AdminBilling) => (
        <p className="text-xs text-foreground tabular-nums">
          {(b.plan.monthlyPriceCents / 100).toLocaleString('en-US', {
            style: 'currency', currency: 'USD',
          })}
        </p>
      ),
    },
    {
      key: 'period',
      header: 'Current Period',
      render: (b: AdminBilling) => (
        <div className="text-[11px] text-muted-foreground">
          <p>{format(new Date(b.currentPeriodStart), 'MMM d')} –</p>
          <p>{format(new Date(b.currentPeriodEnd), 'MMM d, yyyy')}</p>
        </div>
      ),
    },
    {
      key: 'lastInvoice',
      header: 'Last Invoice',
      render: (b: AdminBilling) => {
        const inv = b.recentInvoices[0];
        if (!inv) return <span className="text-[11px] text-muted-foreground">—</span>;
        return (
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums text-foreground">
              {(inv.amountPaid / 100).toLocaleString('en-US', {
                style: 'currency', currency: inv.currency.toUpperCase(),
              })}
            </span>
            {inv.invoicePdf && (
              <Link
                href={inv.invoicePdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline"
              >
                PDF
              </Link>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        icon={<CreditCard className="w-5 h-5 text-primary" />}
        title="Billing"
        count={data?.pagination.totalCount}
        search={search}
        onSearch={handleSearch}
        placeholder="Search workspace or owner…"
      />

      <AdminTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
      />

      <Pagination
        currentPage={page}
        totalPages={data?.pagination.totalPages ?? 1}
        onPageChange={setPage}
        itemsPerPage={pageSize}
        totalItems={data?.pagination.totalCount}
      />
    </div>
  );
}