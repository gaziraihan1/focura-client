export type JobDepartment   = 'ENGINEERING' | 'DESIGN' | 'PRODUCT' | 'MARKETING' | 'SALES' | 'CUSTOMER_SUCCESS' | 'OPERATIONS' | 'FINANCE' | 'HR' | 'OTHER';
export type JobLocationType = 'REMOTE' | 'ONSITE' | 'HYBRID';
export type JobType         = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
export type JobExperience   = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD' | 'EXECUTIVE';
export type JobStatus       = 'DRAFT' | 'OPEN' | 'PAUSED' | 'CLOSED';

export type CreateJobPayload = Omit<JobPosting,
  'id' | 'createdAt' | 'updatedAt' | 'slug' | 'viewCount'
>;

export type UpdateJobPayload = Partial<CreateJobPayload>;

export interface JobPosting {
  id              : string;
  title           : string;
  slug            : string;
  department      : JobDepartment;
  location        : string;
  locationType    : JobLocationType;
  type            : JobType;
  experienceLevel : JobExperience;
  salaryMin       : number | null;
  salaryMax       : number | null;
  salaryCurrency  : string;
  description     : string;
  requirements    : string;
  niceToHave      : string | null;
  benefits        : string | null;
  isPinned        : boolean;
  closingDate     : string | null;
  publishedAt     : string | null;
  applicationUrl  : string | null;
  applicationEmail: string | null;
  status: JobStatus;
}

export type JobListItem = Omit<JobPosting, 'description' | 'requirements' | 'niceToHave' | 'benefits'>

// ─── Display label maps ───────────────────────────────────────────────────────
export const DEPARTMENT_LABELS: Record<JobDepartment, string> = {
  ENGINEERING     : 'Engineering',
  DESIGN          : 'Design',
  PRODUCT         : 'Product',
  MARKETING       : 'Marketing',
  SALES           : 'Sales',
  CUSTOMER_SUCCESS: 'Customer Success',
  OPERATIONS      : 'Operations',
  FINANCE         : 'Finance',
  HR              : 'People & HR',
  OTHER           : 'Other',
};

export const LOCATION_LABELS: Record<JobLocationType, string> = {
  REMOTE : 'Remote',
  ONSITE : 'On-site',
  HYBRID : 'Hybrid',
};

export const TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME : 'Full-time',
  PART_TIME : 'Part-time',
  CONTRACT  : 'Contract',
  INTERNSHIP: 'Internship',
  FREELANCE : 'Freelance',
};

export const EXPERIENCE_LABELS: Record<JobExperience, string> = {
  ENTRY    : 'Entry Level',
  MID      : 'Mid Level',
  SENIOR   : 'Senior Level',
  LEAD     : 'Lead',
  EXECUTIVE: 'Executive',
};