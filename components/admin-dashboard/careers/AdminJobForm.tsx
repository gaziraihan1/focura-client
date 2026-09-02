'use client';

import { useForm }                                    from 'react-hook-form';
import { zodResolver }                                from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2, Save }               from 'lucide-react';
import {
  BasicInfoFields,
  ClassificationFields,
  SalaryFields,
  ContentFields,
  ApplicationFields,
} from './JobFormFields';
import { jobFormSchema, type AdminJobFormValues } from './job-form-schema';
import { Button } from '@/components/ui/Button';

// Re-exported for backward compatibility (useJob.ts / AdminJobManager import
// it from this module historically).
export type { AdminJobFormValues };

interface AdminJobFormProps {
  initial    ?: Partial<AdminJobFormValues>;
  onSubmit    : (data: AdminJobFormValues) => Promise<void>;
  submitLabel : string;
}

// ✅ Type-safe list of form field names for validation
const FORM_FIELDS: readonly (keyof AdminJobFormValues)[] = [
  'title', 'department', 'location', 'locationType', 'type', 'experienceLevel',
  'salaryMin', 'salaryMax', 'salaryCurrency', 'description', 'requirements',
  'niceToHave', 'benefits', 'status', 'closingDate', 'applicationUrl',
  'applicationEmail', 'isPinned',
] as const;

export const AdminJobForm = ({ initial, onSubmit, submitLabel }: AdminJobFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AdminJobFormValues>({
    resolver     : zodResolver(jobFormSchema),
    defaultValues: {
      locationType    : 'REMOTE',
      type            : 'FULL_TIME',
      experienceLevel : 'MID',
      status          : 'DRAFT',
      salaryCurrency  : 'USD',
      isPinned        : false,
      applicationEmail: 'focurabusiness@gmail.com',
      ...initial,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const handleSubmitWithErrors = async (data: AdminJobFormValues) => {
    try {
      await onSubmit(data);
    } catch (err: unknown) {
      interface BackendErrorShape {
        response?: {
          data?: {
            errors?: Record<string, string[]>;
            message?: string;
          };
        };
        message?: string;
      }

      const backendError = err as BackendErrorShape;
      const backendData = backendError.response?.data;

      if (backendData?.errors && typeof backendData.errors === 'object') {
        for (const [field, messages] of Object.entries(backendData.errors)) {
          // ✅ Type-safe check: is this a valid form field?
          if (
            Array.isArray(messages) &&
            messages.length > 0 &&
            FORM_FIELDS.includes(field as keyof AdminJobFormValues)
          ) {
            setError(field as keyof AdminJobFormValues, {
              type: 'server',
              message: messages[0],
            });
          }
        }
        return;
      }

      if (backendData?.message) {
        setError('root', { type: 'server', message: backendData.message });
        return;
      }

      const message = backendError.message ?? 'Something went wrong. Please try again.';
      setError('root', { type: 'server', message });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitWithErrors)} noValidate className='space-y-5'>
      {errors.root && (
        <div className='flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3'>
          <AlertTriangle className='w-4 h-4 shrink-0 text-destructive mt-0.5' strokeWidth={2} />
          <p className='text-sm text-destructive leading-snug'>
            {errors.root.message}
          </p>
        </div>
      )}

      <BasicInfoFields register={register} errors={errors} />
      <ClassificationFields register={register} errors={errors} />
      <SalaryFields register={register} errors={errors} />
      <ContentFields register={register} errors={errors} />
      <ApplicationFields register={register} errors={errors} />

      <div className='pt-2 border-t border-border'>
        <Button
          type='submit'
          variant='primary'
          size='lg'
          disabled={isSubmitting}
          className='rounded-xl px-5 py-3 text-sm font-bold hover:bg-primary/90'
        >
          {isSubmitting ? (
            <>
              <Loader2 className='w-4 h-4 shrink-0 animate-spin' />
              Saving…
            </>
          ) : (
            <>
              <Save className='w-4 h-4 shrink-0' strokeWidth={2} />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};