import { MarkdownDocPage } from '@/features/docs/shared/markdown-doc-page'

export function JsonDecisionModelDocs(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <MarkdownDocPage
      markdownPath='/json-decision-model.md'
      heroTitle='JSON Decision Model'
      heroDescription='该页面聚焦 JDM 决策模型本身的结构、节点、表达式和决策流程，用于查阅概念定义与图模型说明。'
      tocAriaLabel='JDM 文档目录'
      {...props}
    />
  )
}
