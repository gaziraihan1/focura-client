// components/StorageSection.tsx
'use client';

import { ResourceUsageMetrics } from '@/types/workspace-usage.types';
import { HardDrive, File, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  resourceUsage: ResourceUsageMetrics;
}

export function StorageSection({ resourceUsage }: Props) {
  const { totalStorage, storageByProject, filesByUser } = resourceUsage;

  // Storage percentage
  const storagePercentage = totalStorage.percentage;
  const isNearLimit = storagePercentage >= 80;
  const isCritical = storagePercentage >= 95;

  // File type breakdown (mock data based on actual files)
  const fileTypeData = [
    { name: 'Images', value: Math.floor(totalStorage.usedMB * 0.35), color: '#667eea' },
    { name: 'PDFs', value: Math.floor(totalStorage.usedMB * 0.25), color: '#f56565' },
    { name: 'Documents', value: Math.floor(totalStorage.usedMB * 0.20), color: '#48bb78' },
    { name: 'Videos', value: Math.floor(totalStorage.usedMB * 0.15), color: '#ed8936' },
    { name: 'Others', value: Math.floor(totalStorage.usedMB * 0.05), color: '#9f7aea' },
  ];

  // Storage growth trend (last 7 days - mock data)
  const growthTrend = [
    { day: '7d ago', storage: totalStorage.usedMB * 0.75 },
    { day: '6d ago', storage: totalStorage.usedMB * 0.80 },
    { day: '5d ago', storage: totalStorage.usedMB * 0.83 },
    { day: '4d ago', storage: totalStorage.usedMB * 0.88 },
    { day: '3d ago', storage: totalStorage.usedMB * 0.92 },
    { day: '2d ago', storage: totalStorage.usedMB * 0.96 },
    { day: 'Today', storage: totalStorage.usedMB },
  ];

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-900">Storage & Resources</h2>

      {/* Warning Banner (if near limit) */}
      {isNearLimit && (
        <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
          isCritical
            ? 'bg-red-50 border-red-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <AlertTriangle className={`w-5 h-5 shrink-0 ${
            isCritical ? 'text-red-600' : 'text-amber-600'
          }`} />
          <div>
            <p className={`text-sm font-medium ${
              isCritical ? 'text-red-900' : 'text-amber-900'
            }`}>
              {isCritical
                ? '⚠️ Storage limit reached! Upgrade your plan to continue uploading files.'
                : '⚠️ Storage usage is high. Consider upgrading your plan soon.'}
            </p>
          </div>
        </div>
      )}

      {/* Top Row: Storage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Storage Used Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Storage Used</h3>
            <HardDrive className="w-5 h-5 text-primary" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {totalStorage.usedMB >= 1024
                    ? `${(totalStorage.usedMB / 1024).toFixed(1)} GB`
                    : `${Math.round(totalStorage.usedMB)} MB`}
                </span>
                <span className="text-sm text-gray-500">
                  of {totalStorage.totalMB >= 1024
                    ? `${(totalStorage.totalMB / 1024).toFixed(0)} GB`
                    : `${totalStorage.totalMB} MB`}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isCritical
                      ? 'bg-red-500'
                      : isNearLimit
                      ? 'bg-amber-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className={`text-sm font-medium ${
                  isCritical
                    ? 'text-red-600'
                    : isNearLimit
                    ? 'text-amber-600'
                    : 'text-gray-600'
                }`}>
                  {storagePercentage}% used
                </span>
                {isNearLimit && (
                  <button className="text-sm font-medium text-primary hover:underline">
                    Upgrade Plan →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* File Count Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">Total Files</h3>
            <File className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-3">
            <div className="text-3xl font-bold text-gray-900">
              {storageByProject.reduce((sum, proj) => sum + proj.fileCount, 0).toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>+15% this month</span>
            </div>

            {/* Mini file type breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              {fileTypeData.slice(0, 3).map((type) => (
                <div key={type.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{type.name}</span>
                  <span className="font-medium text-gray-900">
                    {Math.round(type.value)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Storage Growth Trend */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Storage Growth Trend (7 days)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={growthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
                formatter={(value) => [`${Math.round(Number(value))} MB`, 'Storage']}
              />
              <Bar dataKey="storage" fill="#667eea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Projects by Storage */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Top 5 Projects by Storage
          </h3>
          <div className="space-y-3">
            {storageByProject.slice(0, 5).map((project) => (
              <div key={project.projectId} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: project.projectName ? '#667eea' : '#9ca3af' }}
                    />
                    <span className="font-medium text-gray-900 truncate">
                      {project.projectName}
                    </span>
                  </div>
                  <span className="text-gray-600 ml-2 shrink-0">
                    {project.storageUsedMB >= 1024
                      ? `${(project.storageUsedMB / 1024).toFixed(1)} GB`
                      : `${Math.round(project.storageUsedMB)} MB`}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${project.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: File Type Breakdown + Top Uploaders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Type Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            File Type Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={fileTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {fileTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${Math.round(Number(value))} MB`, 'Size']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top File Uploaders */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Top File Uploaders
          </h3>
          <div className="space-y-4">
            {filesByUser.slice(0, 5).map((user, index) => (
              <div key={user.userId} className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-500 w-6">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {user.userName || 'Unknown User'}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {user.fileCount} files
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 ml-2 shrink-0">
                  {user.storageUsedMB >= 1024
                    ? `${(user.storageUsedMB / 1024).toFixed(1)} GB`
                    : `${Math.round(user.storageUsedMB)} MB`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}