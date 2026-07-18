'use client';

import { useForm }                                    from 'react-hook-form';
import { zodResolver }                                from '@hookform/resolvers/zod';
import { z }                                          from 'zod';
import { AlertTriangle, Loader2, Save }               from 'lucide-react';
import {
  BasicInfoFields,
  ClassificationFields,
  SalaryFields,
  ContentFields,
  ApplicationFields,
} from './JobFormFields';

const formSchema = z.object({
  title           : z.string().trim().min(3, 'Title is required').max(150),
  department      : z.string().min(1, 'Department is required'),
  location        : z.string().trim().min(2, 'Location is required').max(100),
  locationType    : z.string().min(1),
  type            : z.string().min(1),
  experienceLevel : z.string().min(1),
  salaryMin : z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().positive().optional()
  ),
  salaryMax : z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().positive().optional()
  ),
  salaryCurrency  : z.string().length(3, 'Must be a 3-letter code'),
  description     : z.string().trim().min(50, 'Description must be at least 50 characters'),
  requirements    : z.string().trim().min(20, 'Requirements must be at least 20 characters'),
  niceToHave      : z.string().trim().optional(),
  benefits        : z.string().trim().optional(),
  status          : z.string().min(1),
  closingDate     : z.string().optional(),
  applicationUrl  : z.string().url('Must be a valid URL').optional().or(z.literal('')),
  applicationEmail: z.string().email('Must be a valid email').optional().or(z.literal('')),
  isPinned        : z.boolean(),
}).refine(
  (d) => {
    if (d.salaryMin !== undefined && d.salaryMax !== undefined) {
      return d.salaryMax >= d.salaryMin;
    }
    return true;
  },
  { message: 'Salary max must be ≥ salary min', path: ['salaryMax'] }
);

export type AdminJobFormValues = z.infer<typeof formSchema>;

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
    resolver     : zodResolver(formSchema),
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
        <button
          type='submit'
          disabled={isSubmitting}
          className='inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-5 py-3 text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
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
        </button>
      </div>
    </form>
  );
};