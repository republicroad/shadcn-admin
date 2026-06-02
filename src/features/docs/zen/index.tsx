import { MarkdownDocPage } from '@/features/docs/shared/markdown-doc-page'

export function ZenExpressionDocs(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <MarkdownDocPage
      markdownPath='/zen-expression.md'
      heroTitle='Expression Language'
      heroDescription='该页面聚焦 ZEN Expression 的规则编写方式，按语法层次组织目录，适合查阅函数、运算符和各数据类型能力。'
      tocAriaLabel='ZEN 文档目录'
      {...props}
    />
  )
}
