'use client';

import { TasksByPriorityItem } from '@/hooks/useAnalytics';
import { priorityDistribution } from '@/utils/analytics.utils';
import {  Clock } from 'lucide-react';

interface PriorityDistributionProps {
  data: TasksByPriorityItem[];
}

export function PriorityDistribution({ data }: PriorityDistributionProps) {
  const {maxCount, priorityConfig, total} = priorityDistribution({data})

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Tasks by Priority</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Active and in-progress tasks
        </p>
      </div>

      <div className="space-y-4">
        {data.map((item) => {
          const config = priorityConfig[item.priority as keyof typeof priorityConfig];
          if (!config) return null;

          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const widthPercentage = (item.count / maxCount) * 100;
          const Icon = config.icon;

          return (
            <div key={item.priority}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${config.bgColor}`}>
                    <Icon className={`w-3.5 h-3.5 ${config.textColor}`} />
                  </div>
                  <span className="text-sm font-medium">{config.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{percentage}%</span>
                  <span className="text-sm font-semibold min-w-8 text-right">
                    {item.count}
                  </span>
                </div>
              </div>

              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full ${config.color} rounded-full transition-all duration-500`}
                  style={{ width: `${widthPercentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No active tasks</p>
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="mt-6 pt-6 border-t flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Active Tasks</span>
          <span className="text-lg font-bold">{total}</span>
        </div>
      )}
    </div>
  );
}