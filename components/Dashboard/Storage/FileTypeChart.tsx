'use client';

import { m as motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
// oxlint-disable-next-line react-doctor/prefer-dynamic-import -- recharts only ships when this chart mounts
} from 'recharts';
import { FileTypeBreakdown } from '@/hooks/useStorage';
import { formatStorageSize } from '@/hooks/useStoragePage';

const CATEGORY_COLORS: Record<string, string> = {
  images: '#818cf8',
  videos: '#a78bfa',
  pdfs: '#f87171',
  documents: '#34d399',
  archives: '#fb923c',
  other: '#94a3b8',
};

interface FileTypeChartProps {
  types: FileTypeBreakdown[];
}

interface ChartDatum {
  name: string;
  value: number;
  count: number;
  color: string;
}

function FileTypeTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number }>;
}) {
  if (!active || !payload?.length || payload[0].value == null) return null;
  return (
    <div className="rounded-lg border border-border bg-popover/90 backdrop-blur-md px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold mb-1">{payload[0].name}</p>
      <p className="text-muted-foreground">{formatStorageSize(payload[0].value)}</p>
    </div>
  );
}

export function FileTypeChart({ types }: FileTypeChartProps) {
  const list = types ?? [];

  const byCategory = list.reduce<Record<string, { sizeMB: number; count: number }>>(
    (acc, entry) => {
      const key = entry.category?.trim() || 'other';
      const bucket = (acc[key] ??= { sizeMB: 0, count: 0 });
      bucket.sizeMB += entry.sizeMB ?? 0;
      bucket.count += entry.count ?? 0;
      return acc;
    },
    {},
  );

  const data: ChartDatum[] = Object.entries(byCategory)
    .map(([category, { sizeMB, count }]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      value: sizeMB,
      count,
      color: CATEGORY_COLORS[category.toLowerCase()] ?? CATEGORY_COLORS.other,
    }))
    .sort((a, b) => b.value - a.value);

  const totalSize = data.reduce((sum, item) => sum + item.value, 0);
  const totalFiles = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-lg p-6"
    >
      <h2 className="sm:text-lg font-semibold">Storage by File Type</h2>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1 mb-6">
        Distribution across categories
      </p>

      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">No file type data available yet.</p>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={82}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<FileTypeTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold">{formatStorageSize(totalSize)}</span>
              <span className="text-xs text-muted-foreground">
                {totalFiles.toLocaleString()} files
              </span>
            </div>
          </div>

          <div className="mt-5 w-full space-y-2.5">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: entry.color }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                </span>
                <span className="flex items-baseline gap-2">
                  <span className="font-medium">{formatStorageSize(entry.value)}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(entry.value > 0 ? (entry.value / totalSize) * 100 : 0)}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
