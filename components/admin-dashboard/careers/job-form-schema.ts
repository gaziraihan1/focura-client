import { z } from 'zod';

// Single source of truth for the admin job form contract — shared by
// AdminJobForm (the form owner) and JobFormFields (typed field groups).
export const jobFormSchema = z.object({
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

export type AdminJobFormValues = z.infer<typeof jobFormSchema>;