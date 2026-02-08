export interface PageMeta {
  title: string
  description?: string
  order: number
}

export interface Page extends PageMeta {
  slug: string
}

export interface SectionMeta {
  title: string
  order: number
}

export interface Section extends SectionMeta {
  slug: string
  pages: Page[]
}

export type DocsTree = Section[]