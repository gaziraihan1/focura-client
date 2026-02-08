import { DocsLayoutClient } from "@/components/Docs/DocsSidebar"
import { getDocsTree } from "@/lib/docs/getDocsTree"

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tree = await getDocsTree()

  return <DocsLayoutClient tree={tree}>{children}</DocsLayoutClient>
}