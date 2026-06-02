import { isValidElement, type ReactNode } from 'react'
import { type Components } from 'react-markdown'
import { cn } from '@/lib/utils'

export type TocItem = {
  id: string
  level: number
  text: string
}

function slugifyHeading(text: string) {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[`*_~[\]()]/g, '')
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return slug || 'section'
}

function stripMarkdownInline(text: string) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

function collectNodeText(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children)
  }

  if (Array.isArray(children)) {
    return children.map(collectNodeText).join('')
  }

  if (isValidElement(children)) {
    return collectNodeText(children.props.children)
  }

  return ''
}

function createHeadingIdFactory() {
  const slugCount = new Map<string, number>()

  return (text: string) => {
    const baseId = slugifyHeading(stripMarkdownInline(text))
    const count = slugCount.get(baseId) ?? 0
    slugCount.set(baseId, count + 1)

    return count === 0 ? baseId : `${baseId}-${count}`
  }
}

export function normalizeMarkdownImageSrc(src?: string) {
  if (!src) {
    return src
  }

  if (src.startsWith('/image/')) {
    return src.replace('/image/', '/images/')
  }

  if (src.startsWith('image/')) {
    return `/${src.replace('image/', 'images/')}`
  }

  return src
}

export function extractTableOfContents(markdown: string) {
  const lines = markdown.split('\n')
  const createHeadingId = createHeadingIdFactory()
  const toc: TocItem[] = []
  let inCodeBlock = false
  let fenceMarker = ''

  for (const line of lines) {
    const fenceMatch = line.match(/^\s*(`{3,}|~{3,})(.*)$/)
    if (fenceMatch) {
      const marker = fenceMatch[1]

      if (!inCodeBlock) {
        inCodeBlock = true
        fenceMarker = marker
        continue
      }

      const isClosingFence = new RegExp(
        `^\\s*${fenceMarker[0]}{${fenceMarker.length},}\\s*$`
      ).test(line)

      if (isClosingFence) {
        inCodeBlock = false
        fenceMarker = ''
      }

      continue
    }

    if (inCodeBlock) {
      continue
    }

    const match = line.match(/^\s{0,3}(#{1,4})\s+(.+?)\s*#*\s*$/)
    if (!match) {
      continue
    }

    const text = stripMarkdownInline(match[2])
    if (!text) {
      continue
    }

    toc.push({
      id: createHeadingId(text),
      level: match[1].length,
      text,
    })
  }

  return toc
}

export function createMarkdownComponents(headingIds?: string[]): Components {
  const createHeadingId = createHeadingIdFactory()
  let headingIndex = 0

  const resolveHeadingId = (children: ReactNode) => {
    const providedId = headingIds?.[headingIndex]
    headingIndex += 1

    if (providedId) {
      return providedId
    }

    return createHeadingId(stripMarkdownInline(collectNodeText(children)))
  }

  const getHeadingProps = (children: ReactNode) => ({
    id: resolveHeadingId(children),
    'data-doc-heading': 'true',
  })

  return {
    h1: ({ className, children, ...props }) => (
      <h1
        {...getHeadingProps(children)}
        className={cn(
          'mt-10 mb-6 scroll-m-20 text-4xl font-semibold tracking-tight first:mt-0',
          className
        )}
        {...props}
      >
        {children}
      </h1>
    ),
    h2: ({ className, children, ...props }) => (
      <h2
        {...getHeadingProps(children)}
        className={cn(
          'mt-10 mb-4 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0',
          className
        )}
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ className, children, ...props }) => (
      <h3
        {...getHeadingProps(children)}
        className={cn('mt-8 mb-3 scroll-m-20 text-xl font-semibold tracking-tight', className)}
        {...props}
      >
        {children}
      </h3>
    ),
    h4: ({ className, children, ...props }) => (
      <h4
        {...getHeadingProps(children)}
        className={cn('mt-6 mb-2 scroll-m-20 text-lg font-semibold', className)}
        {...props}
      >
        {children}
      </h4>
    ),
    p: ({ className, ...props }) => (
      <p className={cn('my-4 leading-7 text-foreground/90', className)} {...props} />
    ),
    a: ({ className, ...props }) => (
      <a
        className={cn(
          'font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80',
          className
        )}
        {...props}
      />
    ),
    ul: ({ className, ...props }) => (
      <ul className={cn('my-4 ml-6 list-disc space-y-2 marker:text-primary', className)} {...props} />
    ),
    ol: ({ className, ...props }) => (
      <ol
        className={cn('my-4 ml-6 list-decimal space-y-2 marker:text-primary', className)}
        {...props}
      />
    ),
    li: ({ className, ...props }) => (
      <li className={cn('leading-7 text-foreground/90', className)} {...props} />
    ),
    blockquote: ({ className, ...props }) => (
      <blockquote
        className={cn(
          'my-6 border-l-4 border-primary/30 bg-muted/40 py-1 pl-4 italic text-muted-foreground',
          className
        )}
        {...props}
      />
    ),
    table: ({ className, ...props }) => (
      <div className='my-6 overflow-x-auto rounded-lg border'>
        <table className={cn('w-full border-collapse text-sm', className)} {...props} />
      </div>
    ),
    thead: ({ className, ...props }) => (
      <thead className={cn('bg-muted/60 text-left', className)} {...props} />
    ),
    th: ({ className, ...props }) => (
      <th
        className={cn('border-b px-4 py-3 font-semibold whitespace-nowrap', className)}
        {...props}
      />
    ),
    td: ({ className, ...props }) => (
      <td className={cn('border-b px-4 py-3 align-top', className)} {...props} />
    ),
    pre: ({ className, ...props }) => (
      <pre
        className={cn(
          'my-6 overflow-x-auto rounded-xl border bg-card px-4 py-3 font-mono text-sm leading-6 shadow-xs',
          className
        )}
        {...props}
      />
    ),
    code: ({ className, ...props }) => (
      <code
        className={cn(
          'rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]',
          className?.includes('language-') ? 'bg-transparent px-0 py-0 text-inherit' : undefined,
          className
        )}
        {...props}
      />
    ),
    img: ({ className, src, alt, ...props }) => (
      <img
        className={cn('my-6 w-full rounded-xl border bg-card object-contain shadow-xs', className)}
        src={normalizeMarkdownImageSrc(src)}
        alt={alt ?? ''}
        loading='lazy'
        {...props}
      />
    ),
    hr: ({ className, ...props }) => (
      <hr className={cn('my-8 border-border', className)} {...props} />
    ),
    strong: ({ className, ...props }) => (
      <strong className={cn('font-semibold text-foreground', className)} {...props} />
    ),
  }
}
