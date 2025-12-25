export function slugify(text: string): string {
  return text
    .toLowerCase() 
    .trim() 
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-') 
    .replace(/^-+/, '') 
    .replace(/-+$/, '');
}

export function getWorkspaceSlug(workspace: { id: string; name: string; slug?: string }): string {
  if (workspace.slug) {
    return workspace.slug;
  }
  
  const generatedSlug = slugify(workspace.name);
  
  return generatedSlug || workspace.id;
}


export function getProjectRoute(
  workspaceId: string,
  workspaceName: string,
  projectId: string,
  workspaceSlug?: string
): string {
  const slug = workspaceSlug || slugify(workspaceName) || workspaceId;
  return `/dashboard/workspaces/${slug}/projects/${projectId}`;
}