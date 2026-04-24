interface DataRow {
  category: string;
  examples: string;
  purpose: string;
  retention: string;
}

const rows: DataRow[] = [
  {
    category: "Account Data",
    examples: "Name, email, password hash, profile photo",
    purpose: "Authentication, account management",
    retention: "Until account deletion + 30 days",
  },
  {
    category: "Usage Data",
    examples: "Pages visited, features used, session duration",
    purpose: "Product improvement, analytics",
    retention: "13 months",
  },
  {
    category: "Device & Log Data",
    examples: "IP address, browser type, OS, timestamps",
    purpose: "Security, fraud prevention, debugging",
    retention: "90 days",
  },
  {
    category: "Workspace Content",
    examples: "Tasks, comments, files, project data",
    purpose: "Core service delivery",
    retention: "Until deletion by user + 30 days",
  },
  {
    category: "Payment Data",
    examples: "Last 4 digits, billing address, transaction ID",
    purpose: "Billing and subscription management",
    retention: "7 years (legal obligation)",
  },
  {
    category: "Communications",
    examples: "Support emails, feedback, survey responses",
    purpose: "Customer support, service improvement",
    retention: "3 years",
  },
];

export const PrivacyDataTable = () => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-neutral-50 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800">
            <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              Data Category
            </th>
            <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300">
              Examples
            </th>
            <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              Purpose
            </th>
            <th className="text-left px-4 py-3 font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
              Retention
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.category}
              className={
                i < rows.length - 1
                  ? "border-b border-neutral-100 dark:border-neutral-800/60"
                  : ""
              }
            >
              <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap align-top">
                {row.category}
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 align-top">
                {row.examples}
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 align-top whitespace-nowrap">
                {row.purpose}
              </td>
              <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 align-top whitespace-nowrap">
                {row.retention}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};