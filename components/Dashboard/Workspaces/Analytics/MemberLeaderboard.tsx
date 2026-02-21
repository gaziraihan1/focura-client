'use client';

import { MemberContribution } from '@/hooks/useAnalytics';
import { formatHours, getInitials } from '@/utils/analytics.utils';
import { Crown, User } from 'lucide-react';
import Image from 'next/image';

interface MemberLeaderboardProps {
  data: MemberContribution[];
}

export function MemberLeaderboard({ data }: MemberLeaderboardProps) {
  const maxScore = Math.max(...data.map((m) => m.contributionScore), 1);

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Team Leaderboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Top contributors by activity
          </p>
        </div>
        <div className="px-3 py-1.5 bg-primary/10 rounded-lg">
          <span className="text-sm font-medium text-primary">
            {data.length} member{data.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((member, index) => {
          const widthPercentage = (member.contributionScore / maxScore) * 100;

          return (
            <div
              key={member.userId}
              className="group p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Rank Badge */}
                  {index < 3 && (
                    <div
                      className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        index === 0
                          ? 'bg-yellow-500 text-white'
                          : index === 1
                          ? 'bg-gray-400 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {index + 1}
                    </div>
                  )}

                  {/* Avatar */}
                  {member.userImage ? (
                    <Image
                      src={member.userImage}
                      width={40}
                      height={4}
                      alt={member.userName || 'User'}
                      className="w-10 h-10 rounded-full shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-medium text-primary">
                        {getInitials(member.userName)}
                      </span>
                    </div>
                  )}

                  {/* Name and Role */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {member.userName || 'Unknown User'}
                      </p>
                      {index === 0 && (
                        <Crown className="w-3 h-3 text-yellow-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {member.userEmail}
                    </p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0 ml-4">
                  <p className="text-lg font-bold">{Math.round(member.contributionScore)}</p>
                  <p className="text-xs text-muted-foreground">score</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-sm font-semibold">{member.completedTasks}</p>
                  <p className="text-xs text-muted-foreground">Tasks</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">{formatHours(member.totalHours)}</p>
                  <p className="text-xs text-muted-foreground">Hours</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">{member.commentsCount}</p>
                  <p className="text-xs text-muted-foreground">Comments</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold">{member.filesCount}</p>
                  <p className="text-xs text-muted-foreground">Files</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${widthPercentage}%` }}
                />
              </div>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No team members yet</p>
          </div>
        )}
      </div>
    </div>
  );
}