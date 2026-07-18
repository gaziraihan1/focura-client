import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const inputBase   = 'w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 transition-colors';
const inputNormal = 'border-border focus:border-ring focus:ring-ring/30';
const inputErr    = 'border-destructive focus:ring-destructive/30';

export const jobInputBase   = inputBase;
export const jobInputNormal = inputNormal;
export const jobInputErr    = inputErr;

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}

export function JobField({ label, error, required, children, hint }: FieldProps) {
  return (
    <div className='space-y-1.5'>
      <label className='block text-sm font-medium text-foreground'>
        {label}{required && <span className='text-destructive ml-0.5' aria-hidden>*</span>}
      </label>
      {children}
      {hint && !error && <p className='text-xs text-muted-foreground'>{hint}</p>}
      {error && (
        <p className='text-xs text-destructive flex items-center gap-1'>
          <AlertCircle className='w-3 h-3 shrink-0' />
          {error}
        </p>
      )}
    </div>
  );
}

const DEPARTMENTS = [
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
] as const;

const STATUSES = [
  ['DRAFT', 'Draft (hidden)'],
  ['OPEN', 'Open (live)'],
  ['PAUSED', 'Paused'],
  ['CLOSED', 'Closed'],
] as const;

const LOCATION_TYPES = [
  ['REMOTE', 'Remote'],
  ['ONSITE', 'On-site'],
  ['HYBRID', 'Hybrid'],
] as const;

const JOB_TYPES = [
  ['FULL_TIME', 'Full-time'],
  ['PART_TIME', 'Part-time'],
  ['CONTRACT', 'Contract'],
  ['INTERNSHIP', 'Internship'],
  ['FREELANCE', 'Freelance'],
] as const;

const EXPERIENCE_LEVELS = [
  ['ENTRY', 'Entry Level'],
  ['MID', 'Mid Level'],
  ['SENIOR', 'Senior Level'],
  ['LEAD', 'Lead'],
  ['EXECUTIVE', 'Executive'],
] as const;

interface BasicInfoFieldsProps {
  register: any;
  errors: any;
}

export function BasicInfoFields({ register, errors }: BasicInfoFieldsProps) {
  return (
    <>
      <JobField label='Job Title' error={errors.title?.message} required>
        <input
          type='text'
          placeholder='e.g. Senior Frontend Engineer'
          {...register('title')}
          className={cn(inputBase, errors.title ? inputErr : inputNormal)}
        />
      </JobField>

      <div className='grid sm:grid-cols-2 gap-4'>
        <JobField label='Department' error={errors.department?.message} required>
          <select
            {...register('department')}
            className={cn(inputBase, 'cursor-pointer', errors.department ? inputErr : inputNormal)}
          >
            <option value=''>Select department…</option>
            {DEPARTMENTS.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </JobField>

        <JobField label='Status' error={errors.status?.message} required>
          <select
            {...register('status')}
            className={cn(inputBase, 'cursor-pointer', errors.status ? inputErr : inputNormal)}
          >
            {STATUSES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </JobField>
      </div>
    </>
  );
}

interface ClassificationFieldsProps {
  register: any;
  errors: any;
}

export function ClassificationFields({ register, errors }: ClassificationFieldsProps) {
  return (
    <div className='grid sm:grid-cols-3 gap-4'>
      <JobField label='Location' error={errors.location?.message} required>
        <input
          type='text'
          placeholder='e.g. Remote / Dhaka, BD'
          {...register('location')}
          className={cn(inputBase, errors.location ? inputErr : inputNormal)}
        />
      </JobField>

      <JobField label='Location Type'>
        <select {...register('locationType')} className={cn(inputBase, 'cursor-pointer', inputNormal)}>
          {LOCATION_TYPES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </JobField>

      <JobField label='Job Type'>
        <select {...register('type')} className={cn(inputBase, 'cursor-pointer', inputNormal)}>
          {JOB_TYPES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </JobField>
    </div>
  );
}

interface SalaryFieldsProps {
  register: any;
  errors: any;
}

export function SalaryFields({ register, errors }: SalaryFieldsProps) {
  return (
    <div className='grid sm:grid-cols-4 gap-4'>
      <JobField label='Experience Level'>
        <select {...register('experienceLevel')} className={cn(inputBase, 'cursor-pointer', inputNormal)}>
          {EXPERIENCE_LEVELS.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </JobField>

      <JobField label='Salary Min (cents)' hint='Leave blank to hide salary' error={errors.salaryMin?.message}>
        <input
          type='number'
          placeholder='8000000'
          {...register('salaryMin')}
          className={cn(inputBase, errors.salaryMin ? inputErr : inputNormal)}
        />
      </JobField>

      <JobField label='Salary Max (cents)' error={errors.salaryMax?.message}>
        <input
          type='number'
          placeholder='12000000'
          {...register('salaryMax')}
          className={cn(inputBase, errors.salaryMax ? inputErr : inputNormal)}
        />
      </JobField>

      <JobField label='Currency' error={errors.salaryCurrency?.message}>
        <input
          type='text'
          maxLength={3}
          placeholder='USD'
          {...register('salaryCurrency')}
          className={cn(inputBase, errors.salaryCurrency ? inputErr : inputNormal)}
        />
      </JobField>
    </div>
  );
}

interface ContentFieldsProps {
  register: any;
  errors: any;
}

export function ContentFields({ register, errors }: ContentFieldsProps) {
  return (
    <>
      <JobField label='Job Description' error={errors.description?.message} required hint='Supports markdown. Minimum 50 characters.'>
        <textarea
          rows={8}
          placeholder='Describe the role, team context, and day-to-day responsibilities…'
          {...register('description')}
          className={cn(inputBase, 'resize-none', errors.description ? inputErr : inputNormal)}
        />
      </JobField>

      <JobField label='Requirements' error={errors.requirements?.message} required hint='One requirement per line. Markdown supported.'>
        <textarea
          rows={5}
          placeholder={'- 3+ years of TypeScript experience\n- Experience with Next.js App Router…'}
          {...register('requirements')}
          className={cn(inputBase, 'resize-none', errors.requirements ? inputErr : inputNormal)}
        />
      </JobField>

      <JobField label='Nice to Have' error={errors.niceToHave?.message} hint='Optional — preferred but not required qualifications.'>
        <textarea
          rows={3}
          placeholder={'- Familiarity with Prisma ORM\n- Open source contributions…'}
          {...register('niceToHave')}
          className={cn(inputBase, 'resize-none', inputNormal)}
        />
      </JobField>

      <JobField label='Benefits' error={errors.benefits?.message} hint='Optional — perks and compensation beyond salary.'>
        <textarea
          rows={3}
          placeholder={'- Flexible hours\n- Home office stipend\n- Async-first culture…'}
          {...register('benefits')}
          className={cn(inputBase, 'resize-none', inputNormal)}
        />
      </JobField>
    </>
  );
}

interface ApplicationFieldsProps {
  register: any;
  errors: any;
}

export function ApplicationFields({ register, errors }: ApplicationFieldsProps) {
  return (
    <>
      <div className='grid sm:grid-cols-2 gap-4'>
        <JobField label='Application Email' error={errors.applicationEmail?.message}>
          <input
            type='email'
            {...register('applicationEmail')}
            className={cn(inputBase, errors.applicationEmail ? inputErr : inputNormal)}
          />
        </JobField>

        <JobField label='External Application URL' error={errors.applicationUrl?.message} hint='Optional — links to an external ATS portal.'>
          <input
            type='url'
            placeholder='https://…'
            {...register('applicationUrl')}
            className={cn(inputBase, errors.applicationUrl ? inputErr : inputNormal)}
          />
        </JobField>
      </div>

      <div className='grid sm:grid-cols-2 gap-4'>
        <JobField label='Closing Date' error={errors.closingDate?.message} hint='Leave blank for a rolling / no-deadline posting.'>
          <input
            type='date'
            {...register('closingDate')}
            className={cn(inputBase, inputNormal)}
          />
        </JobField>

        <JobField label='Pin this role?' hint='Pinned roles appear above all others on the careers page.'>
          <label className='flex items-center gap-3 mt-1 cursor-pointer'>
            <input
              type='checkbox'
              {...register('isPinned')}
              className='w-4 h-4 rounded border-input accent-primary cursor-pointer'
            />
            <span className='text-sm text-muted-foreground'>
              Pin to top of careers page
            </span>
          </label>
        </JobField>
      </div>
    </>
  );
}
