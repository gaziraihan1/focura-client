import AdminJobsManager from '@/components/AdminDashboard/careers/AdminJobManager';
import type { Metadata }      from 'next';

export const metadata: Metadata = {
  title: 'Job Postings | Admin | Focura',
  description: 'Create, edit, and manage job postings on the Focura careers page.',
};

/**
 * /settings/jobs — Admin only
 *
 * Gated by requireAdminId on the API level.
 * This page is a client-heavy management view — AdminJobsManager owns all state.
 *
 * Features:
 *   - Table of all postings (any status) with status badge, pin indicator, posted date
 *   - "New Role" button → slide-in panel with AdminJobForm (create)
 *   - Edit button per row → same panel pre-filled (update)
 *   - Pin toggle — moves role to top of public careers page
 *   - Status toggle — OPEN ↔ PAUSED without opening the full form
 *   - Delete with two-step confirmation dialog
 */
const AdminJobsPage = () => {
  return (
    <div className='max-w-5xl mx-auto px-6 py-10'>
      <AdminJobsManager />
    </div>
  );
};

export default AdminJobsPage;