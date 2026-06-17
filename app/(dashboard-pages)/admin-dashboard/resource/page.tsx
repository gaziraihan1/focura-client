import { ResourceFormLauncher } from "@/components/AdminDashboard/Resource/ResourceFormLauncher";

export default function AdminResourcesPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Resources</h1>
        <p className="text-sm text-muted-foreground">
          Create popular resources and product updates shown on the public site.
        </p>
      </div>

      <ResourceFormLauncher />
    </div>
  );
}