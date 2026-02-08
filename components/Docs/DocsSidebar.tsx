"use client"

import { useState } from "react"
import type { DocsTree } from "@/types/docs.types"
import DocsDesktop from "./DocsDesktop"
import DocsMobile from "./DocsMobile"
import SidebarButton from "./SidebarButton"

interface DocsLayoutClientProps {
  tree: DocsTree
  children: React.ReactNode
}

export function DocsLayoutClient({ tree, children }: DocsLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <SidebarButton onMenuOpen={setIsMobileMenuOpen} isMobileMenuOpen={isMobileMenuOpen} />

      <div className="flex">
        {isMobileMenuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <DocsMobile onMenuOpen={setIsMobileMenuOpen} tree={tree} />
          </>
        )}

        <DocsDesktop tree={tree} />

        <main className="flex-1 px-4 py-8 lg:px-8 lg:py-8 max-w-4xl mx-auto">
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}