// components/WorkspaceBilling/InvoiceTable.tsx
import { CreditCard, Download } from 'lucide-react';
import { formatCents, formatDate, getInvoiceBadgeClass } from '@/utils/billing.upgrade.utils';
import type { InvoiceTableProps } from '@/types/billing.upgrade.types';

export function BillingInvoiceTable({ invoices }: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <div className="px-6 py-14 text-center">
        <CreditCard className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No invoices yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm table-fixed">
        <thead>
          <tr className="border-b border-border bg-muted/50 text-left text-xs text-muted-foreground uppercase tracking-wider">
            <th className="px-6 py-3 font-medium">Invoice</th>
            <th className="px-6 py-3 font-medium">Period</th>
            <th className="px-6 py-3 font-medium">Amount</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">PDF</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {invoices.map((inv) => (
            <tr
              key={inv.id}
              className="hover:bg-muted/40 transition-colors"
            >
              <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">
                {inv.invoiceNumber ?? `#${inv.id.slice(-8).toUpperCase()}`}
              </td>
              <td className="px-6 py-3.5 text-muted-foreground text-xs">
                {formatDate(inv.periodStart)}
                {inv.periodEnd ? ` – ${formatDate(inv.periodEnd)}` : ''}
              </td>
              <td className="px-6 py-3.5 font-semibold text-foreground">
                {formatCents(inv.amount, inv.currency)}
              </td>
              <td className="px-6 py-3.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getInvoiceBadgeClass(
                    inv.status
                  )}`}
                >
                  {inv.status}
                </span>
              </td>
              <td className="px-6 py-3.5">
                {inv.pdfUrl ? (
                  <a
                    href={inv.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:opacity-80 text-xs font-medium transition-opacity"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </a>
                ) : (
                  <span className="text-muted-foreground/30 text-xs">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}