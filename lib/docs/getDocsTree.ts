import fs from "fs"
import path from "path"
import type { DocsTree } from "@/types/docs.types"
import { pageMetas, sectionMetas } from "@/app/(public-pages)/docs/_registry"

const DOCS_PATH = path.join(process.cwd(), "app/(public-pages)/docs")

export async function getDocsTree(): Promise<DocsTree> {
  const sections = fs
    .readdirSync(DOCS_PATH)
    .filter((name) => {
      const fullPath = path.join(DOCS_PATH, name)
      return (
        fs.statSync(fullPath).isDirectory() &&
        !name.startsWith(".") &&
        !name.startsWith("_")
      )
    })

  const tree = sections.map((section) => {
    const sectionPath = path.join(DOCS_PATH, section)
    const sectionMeta = sectionMetas[section as keyof typeof sectionMetas]

    const pages = fs
      .readdirSync(sectionPath)
      .filter((p) => {
        const pagePath = path.join(sectionPath, p)
        return (
          fs.statSync(pagePath).isDirectory() &&
          fs.existsSync(path.join(pagePath, "page.mdx"))
        )
      })

    const pageItems = pages.map((page) => {
      const pageKey = `${section}/${page}` as keyof typeof pageMetas
      const pageMeta = pageMetas[pageKey]

      return {
        slug: `/docs/${section}/${page}`,
        ...pageMeta,
      }
    })

    return {
      slug: `/docs/${section}`,
      ...sectionMeta,
      pages: pageItems.sort((a, b) => a.order - b.order),
    }
  })

  return tree.sort((a, b) => a.order - b.order)
}