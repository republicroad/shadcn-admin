import { type MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import {
  createMarkdownComponents,
  extractTableOfContents,
  type TocItem,
} from './markdown-doc'

const DOC_SCROLL_OFFSET = 88

type ScrollContainer = Window | HTMLElement

type MarkdownDocPageProps = React.HTMLAttributes<HTMLDivElement> & {
  markdownPath: string
  heroTitle: string
  heroDescription?: string
  tocAriaLabel: string
}

function isScrollable(node: HTMLElement) {
  const { overflowY } = window.getComputedStyle(node)
  return /(auto|scroll|overlay)/.test(overflowY) && node.scrollHeight > node.clientHeight
}

function getScrollContainer(node: HTMLElement | null): ScrollContainer {
  if (!node) {
    return window
  }

  let current = node.parentElement
  while (current) {
    if (isScrollable(current)) {
      return current
    }
    current = current.parentElement
  }

  return window
}

function getScrollMetrics(container: ScrollContainer) {
  if (container === window) {
    const scrollingElement = document.scrollingElement ?? document.documentElement
    return {
      scrollTop: scrollingElement.scrollTop,
      viewportHeight: window.innerHeight,
      scrollHeight: scrollingElement.scrollHeight,
      containerTop: 0,
    }
  }

  const rect = container.getBoundingClientRect()
  return {
    scrollTop: container.scrollTop,
    viewportHeight: container.clientHeight,
    scrollHeight: container.scrollHeight,
    containerTop: rect.top,
  }
}

function getHeadingOffsetTop(element: HTMLElement, container: ScrollContainer) {
  if (container === window) {
    return element.getBoundingClientRect().top + window.scrollY
  }

  const containerRect = container.getBoundingClientRect()
  return element.getBoundingClientRect().top - containerRect.top + container.scrollTop
}

function scrollContainerTo(container: ScrollContainer, top: number, behavior: ScrollBehavior) {
  if (container === window) {
    window.scrollTo({ top, behavior })
    return
  }

  container.scrollTo({ top, behavior })
}

export function MarkdownDocPage({
  markdownPath,
  heroTitle,
  heroDescription,
  tocAriaLabel,
  className,
  ...props
}: MarkdownDocPageProps) {
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [activeId, setActiveId] = useState('')
  const contentRef = useRef<HTMLDivElement | null>(null)
  const tocContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(markdownPath)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        return res.text()
      })
      .then((markdown) => {
        if (!cancelled) {
          setContent(markdown)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('文档加载失败')
        }
      })

    return () => {
      cancelled = true
    }
  }, [markdownPath])

  const toc = useMemo(() => (content ? extractTableOfContents(content) : []), [content])
  const markdownComponents = useMemo(
    () => createMarkdownComponents(toc.map((item) => item.id)),
    [toc]
  )

  useEffect(() => {
    if (!toc.length || !contentRef.current) {
      return
    }

    const container = getScrollContainer(contentRef.current)
    const headings = toc
      .map((item) =>
        contentRef.current?.querySelector<HTMLElement>(`[data-doc-heading="true"]#${CSS.escape(item.id)}`)
      )
      .filter((item): item is HTMLElement => item instanceof HTMLElement)

    if (!headings.length) {
      return
    }

    const offset = DOC_SCROLL_OFFSET + 16
    let ticking = false

    const updateActiveHeading = () => {
      ticking = false

      const { scrollTop, viewportHeight, scrollHeight } = getScrollMetrics(container)

      if (scrollTop + viewportHeight >= scrollHeight - 16) {
        setActiveId(headings.at(-1)?.id ?? '')
        return
      }

      let currentHeading = headings[0]

      for (const heading of headings) {
        const top = getHeadingOffsetTop(heading, container)
        if (top - offset <= scrollTop) {
          currentHeading = heading
        } else {
          break
        }
      }

      setActiveId(currentHeading.id)
    }

    const handleScroll = () => {
      if (ticking) {
        return
      }

      ticking = true
      window.requestAnimationFrame(updateActiveHeading)
    }

    updateActiveHeading()

    if (container === window) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll)

      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleScroll)
      }
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [toc])

  useEffect(() => {
    if (!activeId || !tocContainerRef.current) {
      return
    }

    const activeLink = tocContainerRef.current.querySelector<HTMLButtonElement>(
      `[data-doc-toc-id="${activeId}"]`
    )

    activeLink?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeId])

  useEffect(() => {
    if (!content || !contentRef.current) {
      return
    }

    const hash = window.location.hash.replace('#', '')
    if (!hash) {
      return
    }

    const container = getScrollContainer(contentRef.current)

    requestAnimationFrame(() => {
      const target = contentRef.current?.querySelector<HTMLElement>(
        `[data-doc-heading="true"]#${CSS.escape(hash)}`
      )

      if (!target) {
        return
      }

      setActiveId(hash)
      scrollContainerTo(
        container,
        Math.max(getHeadingOffsetTop(target, container) - DOC_SCROLL_OFFSET, 0),
        'auto'
      )
    })
  }, [content])

  const handleTocClick = (event: MouseEvent<HTMLButtonElement>, item: TocItem) => {
    event.preventDefault()

    if (!contentRef.current) {
      return
    }

    const target = contentRef.current.querySelector<HTMLElement>(
      `[data-doc-heading="true"]#${CSS.escape(item.id)}`
    )

    if (!target) {
      return
    }

    const container = getScrollContainer(contentRef.current)

    setActiveId(item.id)
    scrollContainerTo(
      container,
      Math.max(getHeadingOffsetTop(target, container) - DOC_SCROLL_OFFSET, 0),
      'smooth'
    )
  }

  return (
    <div
      className={cn(
        'relative isolate mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      <div className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.14),transparent_42%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_34%)]' />

      {error ? (
        <div className='rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-5 text-sm text-destructive'>
          {error}
        </div>
      ) : content ? (
        <div className='grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] xl:gap-10'>
          <aside className='space-y-4 lg:sticky lg:top-20 lg:self-start'>
            <div
              ref={tocContainerRef}
              className='hidden max-h-[calc(100vh-22rem)] overflow-y-auto rounded-3xl border bg-card/95 p-4 shadow-xs backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:block'
            >
              <p className='mb-3 text-sm font-semibold tracking-tight'>目录</p>
              <nav aria-label={tocAriaLabel}>
                <ul className='space-y-1'>
                  {toc.map((item) => (
                    <li key={item.id}>
                      <button
                        type='button'
                        data-doc-toc-id={item.id}
                        onClick={(event) => handleTocClick(event, item)}
                        className={cn(
                          'block w-full rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted hover:text-foreground',
                          item.level === 1 && 'font-semibold',
                          item.level === 2 && 'pl-5 text-foreground/85',
                          item.level >= 3 && 'pl-7 text-muted-foreground',
                          activeId === item.id && 'bg-accent text-accent-foreground'
                        )}
                      >
                        {item.text}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <main className='min-w-0'>
            <section className='mb-4 rounded-3xl border bg-card/95 p-5 shadow-xs backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:hidden'>
              <p className='mb-3 text-sm font-semibold tracking-tight'>目录</p>
              <div className='flex gap-2 overflow-x-auto pb-1'>
                {toc.map((item) => (
                  <button
                    key={item.id}
                    type='button'
                    onClick={(event) => handleTocClick(event, item)}
                    className={cn(
                      'shrink-0 rounded-full border px-3 py-1.5 text-sm whitespace-nowrap transition-colors',
                      activeId === item.id
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground'
                    )}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </section>

            <article className='overflow-hidden rounded-[2rem] border bg-card/95 shadow-xs backdrop-blur supports-[backdrop-filter]:bg-card/80'>
              <div className='border-b bg-[linear-gradient(135deg,rgba(34,197,94,0.08),rgba(255,255,255,0)_55%)] px-6 py-6 sm:px-8'>
                <p className='mb-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase'>
                  Documentation
                </p>
                <h2 className='text-3xl font-semibold tracking-tight sm:text-4xl'>{heroTitle}</h2>
                {heroDescription ? (
                  <p className='mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base'>
                    {heroDescription}
                  </p>
                ) : null}
              </div>

              <div ref={contentRef} className='px-6 py-8 sm:px-8 lg:px-10'>
                <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            </article>
          </main>
        </div>
      ) : (
        <div className='rounded-3xl border bg-card/95 px-6 py-5 text-sm text-muted-foreground shadow-xs backdrop-blur supports-[backdrop-filter]:bg-card/80'>
          加载中...
        </div>
      )}
    </div>
  )
}
