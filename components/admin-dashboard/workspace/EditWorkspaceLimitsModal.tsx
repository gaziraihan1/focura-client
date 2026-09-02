'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Loader2, Sparkles } from 'lucide-react';
import { useUpdateWorkspaceLimits } from '@/hooks/useAdmin';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const PLAN_OPTIONS = ['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE'] as const;
type PlanOption = typeof PLAN_OPTIONS[number];

// Recommended starting limits per plan. Selecting a plan auto-fills these —
// admin can still override before saving. Enterprise defaults to unlimited.
const PLAN_PRESETS: Record<PlanOption, { maxMembers: number; maxStorage: number }> = {
  FREE:       { maxMembers: 5,   maxStorage: 1024 },
  PRO:        { maxMembers: 25,  maxStorage: 10240 },
  BUSINESS:   { maxMembers: -1, maxStorage: 102400 },
  ENTERPRISE: { maxMembers: -1,  maxStorage: -1 },
};

// Blank = inherit the plan default (null). Must be a positive integer otherwise.
const aiOverrideField = z
  .string()
  .trim()
  .optional()
  .refine(
    (v) => v === undefined || v === '' || (Number.isInteger(Number(v)) && Number(v) >= 1),
    { message: 'Positive integer, or blank for plan default' },
  );

const formSchema = z
  .object({
    plan: z.enum(PLAN_OPTIONS),
    unlimitedMembers: z.boolean(),
    maxMembers: z.coerce.number().int(),
    unlimitedStorage: z.boolean(),
    maxStorage: z.coerce.number().int(),
    aiDailyCalls: aiOverrideField,
    aiMonthlyTokens: aiOverrideField,
    aiMaxOutputTokens: aiOverrideField,
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

/** '' → null (use plan default); valid number string → number. */
function toAiOverride(v: string | undefined): number | null {
  if (v === undefined || v === '') return null;
  return Number(v);
}

interface EditWorkspaceLimitsModalProps {
  workspaceSlug: string;
  workspaceName: string;
  currentPlan: PlanOption;
  currentMaxMembers: number;
  currentMaxStorage: number; // MB
  currentAiDailyCalls: number | null;
  currentAiMonthlyTokens: number | null;
  currentAiMaxOutputTokens: number | null;
  isOpen: boolean;
  onClose: () => void;
}

function buildDefaults(
  plan: PlanOption,
  maxMembers: number,
  maxStorage: number,
  aiDailyCalls: number | null,
  aiMonthlyTokens: number | null,
  aiMaxOutputTokens: number | null,
): FormValues {
  return {
    plan,
    unlimitedMembers: maxMembers === -1,
    maxMembers: maxMembers === -1 ? PLAN_PRESETS[plan].maxMembers : maxMembers,
    unlimitedStorage: maxStorage === -1,
    maxStorage: maxStorage === -1 ? PLAN_PRESETS[plan].maxStorage : maxStorage,
    aiDailyCalls: aiDailyCalls == null ? '' : String(aiDailyCalls),
    aiMonthlyTokens: aiMonthlyTokens == null ? '' : String(aiMonthlyTokens),
    aiMaxOutputTokens: aiMaxOutputTokens == null ? '' : String(aiMaxOutputTokens),
  };
}

export function EditWorkspaceLimitsModal({
  workspaceSlug,
  workspaceName,
  currentPlan,
  currentMaxMembers,
  currentMaxStorage,
  currentAiDailyCalls,
  currentAiMonthlyTokens,
  currentAiMaxOutputTokens,
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
    defaultValues: buildDefaults(
      currentPlan,
      currentMaxMembers,
      currentMaxStorage,
      currentAiDailyCalls,
      currentAiMonthlyTokens,
      currentAiMaxOutputTokens,
    ),
  });

  // Re-sync whenever a different workspace's modal is opened
  useEffect(() => {
    if (isOpen) {
      reset(buildDefaults(
        currentPlan,
        currentMaxMembers,
        currentMaxStorage,
        currentAiDailyCalls,
        currentAiMonthlyTokens,
        currentAiMaxOutputTokens,
      ));
    }
  }, [isOpen, currentPlan, currentMaxMembers, currentMaxStorage, currentAiDailyCalls, currentAiMonthlyTokens, currentAiMaxOutputTokens, reset]);

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
        aiDailyCalls: toAiOverride(values.aiDailyCalls),
        aiMonthlyTokens: toAiOverride(values.aiMonthlyTokens),
        aiMaxOutputTokens: toAiOverride(values.aiMaxOutputTokens),
      },
      { onSuccess: onClose },
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            Edit Limits — {workspaceName}
          </h2>
          <Button onClick={onClose} variant="ghost" className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="fld-4">Plan</label>
            <select id="fld-4"
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
              <label className="text-xs font-medium text-muted-foreground" htmlFor="fld-5">Max members</label>
              <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <input type="checkbox" {...register('unlimitedMembers')} className="rounded border-border" id="fld-5" />
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
              <label className="text-xs font-medium text-muted-foreground" htmlFor="fld-6">Max storage (MB)</label>
              <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <input type="checkbox" {...register('unlimitedStorage')} className="rounded border-border" id="fld-6" />
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

          {/* AI limit overrides — optional, blank = inherit the plan default */}
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs font-semibold text-foreground">AI limits (optional)</p>
            </div>
            <p className="text-[10px] text-muted-foreground -mt-1">
              Blank fields fall back to the workspace plan&apos;s AI limits. Set a value to raise or lower them.
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { key: 'aiDailyCalls', label: 'Daily AI calls' },
                { key: 'aiMonthlyTokens', label: 'Monthly token budget' },
                { key: 'aiMaxOutputTokens', label: 'Max output tokens / call' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground" htmlFor={`fld-${key}`}>
                    {label}
                  </label>
                  <input
                    id={`fld-${key}`}
                    type="number"
                    min={1}
                    placeholder="Plan default"
                    {...register(key as 'aiDailyCalls' | 'aiMonthlyTokens' | 'aiMaxOutputTokens')}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60"
                  />
                  {errors[key as 'aiDailyCalls' | 'aiMonthlyTokens' | 'aiMaxOutputTokens'] && (
                    <p className="text-[11px] text-destructive">
                      {errors[key as 'aiDailyCalls' | 'aiMonthlyTokens' | 'aiMaxOutputTokens']?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isPending}
              className="text-xs px-3 py-1.5 rounded-lg hover:opacity-90 transition-colors flex items-center gap-1.5"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
