'use client';

import { useForm }                                    from 'react-hook-form';
import { zodResolver }                                from '@hookform/resolvers/zod';
import { z }                                          from 'zod';
import { AlertCircle, AlertTriangle, Loader2, Save }  from 'lucide-react';
import { cn }                                         from '@/lib/utils';

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

const inputBase   = 'w-full rounded-xl border px-3.5 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 bg-white dark:bg-neutral-900 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:ring-2 transition-colors';
const inputNormal = 'border-neutral-200 dark:border-neutral-700 focus:border-neutral-400 dark:focus:border-neutral-500 focus:ring-neutral-100 dark:focus:ring-neutral-800';
const inputErr    = 'border-red-300 dark:border-red-700 focus:ring-red-100 dark:focus:ring-red-900/30';

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

function Field({ label, error, required, children, hint }: FieldProps) {
  return (
    <div className='space-y-1.5'>
      <label className='block text-sm font-medium text-neutral-800 dark:text-neutral-200'>
        {label}{required && <span className='text-red-500 ml-0.5' aria-hidden>*</span>}
      </label>
      {children}
      {hint && !error && <p className='text-xs text-neutral-400 dark:text-neutral-500'>{hint}</p>}
      {error && (
        <p className='text-xs text-red-600 dark:text-red-400 flex items-center gap-1'>
          <AlertCircle className='w-3 h-3 shrink-0' />
          {error}
        </p>
      )}
    </div>
  );
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
        <div className='flex items-start gap-2.5 rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-950/20 px-4 py-3'>
          <AlertTriangle className='w-4 h-4 shrink-0 text-red-500 dark:text-red-400 mt-0.5' strokeWidth={2} />
          <p className='text-sm text-red-700 dark:text-red-300 leading-snug'>
            {errors.root.message}
          </p>
        </div>
      )}

      <Field label='Job Title' error={errors.title?.message} required>
        <input
          type='text'
          placeholder='e.g. Senior Frontend Engineer'
          {...register('title')}
          className={cn(inputBase, errors.title ? inputErr : inputNormal)}
        />
      </Field>

      <div className='grid sm:grid-cols-2 gap-4'>
        <Field label='Department' error={errors.department?.message} required>
          <select
            {...register('department')}
            className={cn(inputBase, 'cursor-pointer', errors.department ? inputErr : inputNormal)}
          >
            <option value=''>Select department…</option>
            {([
              ['ENGINEERING',      'Engineering'],
              ['DESIGN',           'Design'],
              ['PRODUCT',          'Product'],
              ['MARKETING',        'Marketing'],
              ['SALES',            'Sales'],
              ['CUSTOMER_SUCCESS', 'Customer Success'],
              ['OPERATIONS',       'Operations'],
              ['FINANCE',          'Finance'],
              ['HR',               'People & HR'],
              ['OTHER',            'Other'],
            ] as const).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </Field>

        <Field label='Status' error={errors.status?.message} required>
          <select
            {...register('status')}
            className={cn(inputBase, 'cursor-pointer', errors.status ? inputErr : inputNormal)}
          >
            <option value='DRAFT'>Draft (hidden)</option>
            <option value='OPEN'>Open (live)</option>
            <option value='PAUSED'>Paused</option>
            <option value='CLOSED'>Closed</option>
          </select>
        </Field>
      </div>

      <div className='grid sm:grid-cols-3 gap-4'>
        <Field label='Location' error={errors.location?.message} required>
          <input
            type='text'
            placeholder='e.g. Remote / Dhaka, BD'
            {...register('location')}
            className={cn(inputBase, errors.location ? inputErr : inputNormal)}
          />
        </Field>

        <Field label='Location Type'>
          <select {...register('locationType')} className={cn(inputBase, 'cursor-pointer', inputNormal)}>
            <option value='REMOTE'>Remote</option>
            <option value='ONSITE'>On-site</option>
            <option value='HYBRID'>Hybrid</option>
          </select>
        </Field>

        <Field label='Job Type'>
          <select {...register('type')} className={cn(inputBase, 'cursor-pointer', inputNormal)}>
            <option value='FULL_TIME'>Full-time</option>
            <option value='PART_TIME'>Part-time</option>
            <option value='CONTRACT'>Contract</option>
            <option value='INTERNSHIP'>Internship</option>
            <option value='FREELANCE'>Freelance</option>
          </select>
        </Field>
      </div>

      <div className='grid sm:grid-cols-4 gap-4'>
        <Field label='Experience Level'>
          <select {...register('experienceLevel')} className={cn(inputBase, 'cursor-pointer', inputNormal)}>
            <option value='ENTRY'>Entry Level</option>
            <option value='MID'>Mid Level</option>
            <option value='SENIOR'>Senior Level</option>
            <option value='LEAD'>Lead</option>
            <option value='EXECUTIVE'>Executive</option>
          </select>
        </Field>

        <Field label='Salary Min (cents)' hint='Leave blank to hide salary' error={errors.salaryMin?.message}>
          <input
            type='number'
            placeholder='8000000'
            {...register('salaryMin')}
            className={cn(inputBase, errors.salaryMin ? inputErr : inputNormal)}
          />
        </Field>

        <Field label='Salary Max (cents)' error={errors.salaryMax?.message}>
          <input
            type='number'
            placeholder='12000000'
            {...register('salaryMax')}
            className={cn(inputBase, errors.salaryMax ? inputErr : inputNormal)}
          />
        </Field>

        <Field label='Currency' error={errors.salaryCurrency?.message}>
          <input
            type='text'
            maxLength={3}
            placeholder='USD'
            {...register('salaryCurrency')}
            className={cn(inputBase, errors.salaryCurrency ? inputErr : inputNormal)}
          />
        </Field>
      </div>

      <Field label='Job Description' error={errors.description?.message} required hint='Supports markdown. Minimum 50 characters.'>
        <textarea
          rows={8}
          placeholder='Describe the role, team context, and day-to-day responsibilities…'
          {...register('description')}
          className={cn(inputBase, 'resize-none', errors.description ? inputErr : inputNormal)}
        />
      </Field>

      <Field label='Requirements' error={errors.requirements?.message} required hint='One requirement per line. Markdown supported.'>
        <textarea
          rows={5}
          placeholder={'- 3+ years of TypeScript experience\n- Experience with Next.js App Router…'}
          {...register('requirements')}
          className={cn(inputBase, 'resize-none', errors.requirements ? inputErr : inputNormal)}
        />
      </Field>

      <Field label='Nice to Have' error={errors.niceToHave?.message} hint='Optional — preferred but not required qualifications.'>
        <textarea
          rows={3}
          placeholder={'- Familiarity with Prisma ORM\n- Open source contributions…'}
          {...register('niceToHave')}
          className={cn(inputBase, 'resize-none', inputNormal)}
        />
      </Field>

      <Field label='Benefits' error={errors.benefits?.message} hint='Optional — perks and compensation beyond salary.'>
        <textarea
          rows={3}
          placeholder={'- Flexible hours\n- Home office stipend\n- Async-first culture…'}
          {...register('benefits')}
          className={cn(inputBase, 'resize-none', inputNormal)}
        />
      </Field>

      <div className='grid sm:grid-cols-2 gap-4'>
        <Field label='Application Email' error={errors.applicationEmail?.message}>
          <input
            type='email'
            {...register('applicationEmail')}
            className={cn(inputBase, errors.applicationEmail ? inputErr : inputNormal)}
          />
        </Field>

        <Field label='External Application URL' error={errors.applicationUrl?.message} hint='Optional — links to an external ATS portal.'>
          <input
            type='url'
            placeholder='https://…'
            {...register('applicationUrl')}
            className={cn(inputBase, errors.applicationUrl ? inputErr : inputNormal)}
          />
        </Field>
      </div>

      <div className='grid sm:grid-cols-2 gap-4'>
        <Field label='Closing Date' error={errors.closingDate?.message} hint='Leave blank for a rolling / no-deadline posting.'>
          <input
            type='date'
            {...register('closingDate')}
            className={cn(inputBase, inputNormal)}
          />
        </Field>

        <Field label='Pin this role?' hint='Pinned roles appear above all others on the careers page.'>
          <label className='flex items-center gap-3 mt-1 cursor-pointer'>
            <input
              type='checkbox'
              {...register('isPinned')}
              className='w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-neutral-100 cursor-pointer'
            />
            <span className='text-sm text-neutral-600 dark:text-neutral-400'>
              Pin to top of careers page
            </span>
          </label>
        </Field>
      </div>

      <div className='pt-2 border-t border-neutral-100 dark:border-neutral-800'>
        <button
          type='submit'
          disabled={isSubmitting}
          className='inline-flex items-center gap-2 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-xl px-5 py-3 text-sm font-bold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
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