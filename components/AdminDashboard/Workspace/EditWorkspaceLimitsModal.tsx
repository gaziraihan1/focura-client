'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2 } from 'lucide-react';
import { useUpdateWorkspaceLimits } from '@/hooks/useAdmin';
import { cn } from '@/lib/utils';

const PLAN_OPTIONS = ['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE'] as const;
type PlanOption = typeof PLAN_OPTIONS[number];

// Recommended starting limits per plan. Selecting a plan auto-fills these —
// admin can still override before saving. Enterprise defaults to unlimited.
const PLAN_PRESETS: Record<PlanOption, { maxMembers: number; maxStorage: number }> = {
  FREE:       { maxMembers: 5,   maxStorage: 1024 },
  PRO:        { maxMembers: 25,  maxStorage: 10240 },
  BUSINESS:   { maxMembers: 100, maxStorage: 51200 },
  ENTERPRISE: { maxMembers: -1,  maxStorage: -1 },
};

const formSchema = z
  .object({
    plan: z.enum(PLAN_OPTIONS),
    unlimitedMembers: z.boolean(),
    maxMembers: z.coerce.number().int(),
    unlimitedStorage: z.boolean(),
    maxStorage: z.coerce.number().int(),
  })
  .refine((d) => d.unlimitedMembers || d.maxMembers > 0, {
    message: 'Enter a positive number, or check Unlimited',
    path: ['maxMembers'],
  })
  .refine((d) => d.unlimitedStorage || d.maxStorage > 0, {
    message: 'Enter a positive number, or check Unlimited',
    path: ['maxStorage'],
  });

type FormValues = z.infer<typeof formSchema>;

interface EditWorkspaceLimitsModalProps {
  workspaceSlug: string;
  workspaceName: string;
  currentPlan: PlanOption;
  currentMaxMembers: number;
  currentMaxStorage: number; // MB
  isOpen: boolean;
  onClose: () => void;
}

function buildDefaults(
  plan: PlanOption,
  maxMembers: number,
  maxStorage: number,
): FormValues {
  return {
    plan,
    unlimitedMembers: maxMembers === -1,
    maxMembers: maxMembers === -1 ? PLAN_PRESETS[plan].maxMembers : maxMembers,
    unlimitedStorage: maxStorage === -1,
    maxStorage: maxStorage === -1 ? PLAN_PRESETS[plan].maxStorage : maxStorage,
  };
}

export function EditWorkspaceLimitsModal({
  workspaceSlug,
  workspaceName,
  currentPlan,
  currentMaxMembers,
  currentMaxStorage,
  isOpen,
  onClose,
}: EditWorkspaceLimitsModalProps) {
  const { mutate, isPending } = useUpdateWorkspaceLimits();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: buildDefaults(currentPlan, currentMaxMembers, currentMaxStorage),
  });

  // Re-sync whenever a different workspace's modal is opened
  useEffect(() => {
    if (isOpen) {
      reset(buildDefaults(currentPlan, currentMaxMembers, currentMaxStorage));
    }
  }, [isOpen, currentPlan, currentMaxMembers, currentMaxStorage, reset]);

  const unlimitedMembers = watch('unlimitedMembers');
  const unlimitedStorage = watch('unlimitedStorage');

  function applyPreset(plan: PlanOption) {
    const preset = PLAN_PRESETS[plan];
    setValue('unlimitedMembers', preset.maxMembers === -1);
    setValue('maxMembers', preset.maxMembers === -1 ? 0 : preset.maxMembers);
    setValue('unlimitedStorage', preset.maxStorage === -1);
    setValue('maxStorage', preset.maxStorage === -1 ? 0 : preset.maxStorage);
  }

  function onSubmit(values: FormValues) {
    mutate(
      {
        slug: workspaceSlug,
        plan: values.plan,
        maxMembers: values.unlimitedMembers ? -1 : values.maxMembers,
        maxStorage: values.unlimitedStorage ? -1 : values.maxStorage,
      },
      { onSuccess: onClose },
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Edit Limits — {workspaceName}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Plan</label>
            <select
              {...register('plan', {
                onChange: (e) => applyPreset(e.target.value as PlanOption),
              })}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {PLAN_OPTIONS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <p className="text-[10px] text-muted-foreground">
              Switching plans fills in recommended limits below — adjust freely before saving.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Max members</label>
              <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <input type="checkbox" {...register('unlimitedMembers')} className="rounded border-border" />
                Unlimited
              </label>
            </div>
            <input
              type="number"
              min={1}
              disabled={unlimitedMembers}
              {...register('maxMembers')}
              className={cn(
                'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground',
                unlimitedMembers && 'opacity-40',
              )}
            />
            {errors.maxMembers && (
              <p className="text-[11px] text-destructive">{errors.maxMembers.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Max storage (MB)</label>
              <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <input type="checkbox" {...register('unlimitedStorage')} className="rounded border-border" />
                Unlimited
              </label>
            </div>
            <input
              type="number"
              min={1}
              disabled={unlimitedStorage}
              {...register('maxStorage')}
              className={cn(
                'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground',
                unlimitedStorage && 'opacity-40',
              )}
            />
            {errors.maxStorage && (
              <p className="text-[11px] text-destructive">{errors.maxStorage.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors disabled:opacity-40 flex items-center gap-1.5"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}