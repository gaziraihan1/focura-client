'use client';

import { motion } from 'framer-motion';
import { Users, Crown, User as UserIcon, TrendingUp } from 'lucide-react';
import { UserContribution } from '@/hooks/useStorage';
import { formatStorageSize } from '@/hooks/useStoragePage';

interface UserContributionsTableProps {
  contributions: UserContribution[];
  totalStorageMB: number;
}

export function UserContributionsTable({
  contributions,
  totalStorageMB,
}: UserContributionsTableProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 40) return 'bg-amber-500';
    if (percentage >= 25) return 'bg-blue-500';
    return 'bg-primary';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border rounded-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Team Storage Usage</h2>
            <p className="text-sm text-muted-foreground">
              Storage contribution by team members
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-blue-500/10 rounded-lg">
          <span className="text-sm font-medium text-blue-500">
            {contributions.length} member{contributions.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {contributions.map((user, index) => (
          <motion.div
            key={user.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group p-4 rounded-lg border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <UserIcon className="w-5 h-5 text-primary" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {user.userName || 'Unknown User'}
                    </p>
                    {index === 0 && (
                      <Crown className="w-3 h-3 text-amber-500 shrink-0" xlinkTitle='Top Contributor' />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.userEmail}</p>
                </div>
              </div>

              <div className="text-right shrink-0 ml-4">
                <p className="text-sm font-semibold">{formatStorageSize(user.usageMB)}</p>
                <p className="text-xs text-muted-foreground">{user.fileCount} files</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">Contribution</span>
                <span className="text-xs font-medium">{user.percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${user.percentage}%` }}
                  transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                  className={`h-full rounded-full ${getProgressColor(user.percentage)}`}
                />
              </div>
            </div>
          </motion.div>
        ))}

        {contributions.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No team members found</p>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Total Team Storage
            </span>
          </div>
          <span className="text-lg font-semibold">{formatStorageSize(totalStorageMB)}</span>
        </div>
      </div>
    </motion.div>
  );
}