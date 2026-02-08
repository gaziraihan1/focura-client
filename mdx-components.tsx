import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
import Link from 'next/link'

// Custom components for docs
function DocCards({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 not-prose">
      {children}
    </div>
  )
}

interface DocCardProps {
  href: string
  title: string
  description: string
}

function DocCard({ href, title, description }: DocCardProps) {
  return (
    <Link
      href={href}
      className="group p-6 border border-border rounded-lg hover:border-primary hover:shadow-md transition-all bg-card"
    >
      <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  )
}

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error'
  children: React.ReactNode
}

function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900',
    warning: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900',
    success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900',
    error: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
  }

  return (
    <div className={`p-4 border-l-4 rounded-r-lg my-6 ${styles[type]}`}>
      <div className="text-sm">{children}</div>
    </div>
  )
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-foreground mt-8 mb-4 scroll-mt-20">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-foreground mt-12 mb-4 scroll-mt-20 border-b border-border pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-foreground mt-8 mb-3 scroll-mt-20">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-foreground mt-6 mb-2">
        {children}
      </h4>
    ),

    // Paragraphs and text
    p: ({ children }) => (
      <p className="text-base leading-7 text-foreground mb-4">
        {children}
      </p>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-foreground">{children}</em>
    ),

    // Links
    a: ({ href, children }) => (
      <Link
        href={href as string}
        className="text-primary hover:underline font-medium"
      >
        {children}
      </Link>
    ),

    // Lists
    ul: ({ children }) => (
      <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="text-base leading-7">{children}</li>
    ),

    // Code
    code: ({ children, className }) => {
      const isInline = !className
      return isInline ? (
        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground border border-border">
          {children}
        </code>
      ) : (
        <code className={className}>{children}</code>
      )
    },
    pre: ({ children }) => (
      <pre className="bg-muted border border-border p-4 rounded-lg overflow-x-auto mb-4 text-sm">
        {children}
      </pre>
    ),

    // Blockquotes
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
        {children}
      </blockquote>
    ),

    // Horizontal rule
    hr: () => <hr className="my-8 border-border" />,

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse border border-border">
          {children}
        </table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border border-border px-4 py-2 bg-muted text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2">{children}</td>
    ),

    // Images
    img: (props) => (
      <Image
        {...(props as ImageProps)}
        alt={props.alt || ''}
        width={800}
        height={600}
        className="rounded-lg my-6 border border-border"
      />
    ),

    // Custom components
    DocCards,
    DocCard,
    Callout,

    ...components,
  }
}