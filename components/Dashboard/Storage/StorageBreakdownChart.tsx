'use client';

import { motion } from 'framer-motion';
import { StorageBreakdown } from '@/hooks/useStorage';
import { formatStorageSize } from '@/hooks/useStoragePage';
import { storageBreakdown } from '@/constant/storage.constant';

interface StorageBreakdownChartProps {
  breakdown: StorageBreakdown;
}

export function StorageBreakdownChart({ breakdown }: StorageBreakdownChartProps) {
  const { total } = breakdown;

  const { data } = storageBreakdown({breakdown})

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-lg p-6"
    >
      <h2 className="text-lg font-semibold mb-6">Storage Breakdown</h2>

      <div className="space-y-6">
        <div className="w-full h-4 bg-muted rounded-full overflow-hidden flex">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ width: 0 }}
              animate={{ width: `${item.percentage}%` }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`h-full ${item.color}`}
              title={`${item.label}: ${item.percentage}%`}
            />
          ))}
        </div>

        <div className="space-y-4">
          {data.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${item.color} bg-opacity-10 rounded-lg group-hover:bg-opacity-20 transition-colors`}>
                    <item.icon className={`w-4 h-4 ${item.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatStorageSize(item.value)}</p>
                  <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={`h-full ${item.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Storage</span>
            <span className="text-lg font-semibold">{formatStorageSize(total)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}