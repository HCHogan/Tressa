import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import VirtualizedCodeBlock from './VirtualizedCodeBlock'
import UnifiedCodeBlock from './UnifiedCodeBlock'
import 'katex/dist/katex.min.css'

// 解码HTML实体的工具函数
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// 预处理表格中的管道符号，避免解析错误
function preprocessTablePipes(content: string): string {
  // 匹配表格行（以|开头或包含|的行）
  const lines = content.split('\n')
  const processedLines = lines.map(line => {
    // 检查是否是表格行
    if (line.trim().startsWith('|') || (line.includes('|') && line.includes('---'))) {
      // 在表格行中，保护代码块和内联代码中的管道符号
      return line.replace(/`([^`]*\|[^`]*)`/g, (_, codeContent) => {
        // 将代码中的管道符号临时替换为特殊标记
        return '`' + codeContent.replace(/\|/g, '&#124;') + '`'
      })
    }
    return line
  })

  return processedLines.join('\n')
}

interface EnhancedMarkdownProps {
  content: string
  className?: string
  fontSize?: string
  enableMath?: boolean
  enableCodeHighlighting?: boolean
  showLineNumbers?: boolean
}

interface CodeProps {
  node?: any
  inline?: boolean
  className?: string
  children?: React.ReactNode
  [key: string]: any
}

interface CodeBlockProps {
  language: string
  children: string
  showLineNumbers?: boolean
}

function CodeBlock({ language, children, showLineNumbers = true }: CodeBlockProps) {
  return (
    <UnifiedCodeBlock
      language={language}
      showLineNumbers={showLineNumbers}
      showCopyButton={true}
      showLanguageLabel={true}
      showContainer={true}
      fontSize="14px"
      customStyle={{
        margin: '1.5rem 0'
      }}
    >
      {children}
    </UnifiedCodeBlock>
  )
}

export function EnhancedMarkdown({
  content,
  className = '',
  fontSize = '16px',
  enableMath = true,
  showLineNumbers = true
}: EnhancedMarkdownProps) {
  // 预处理内容，修复表格中的管道符号问题
  const processedContent = preprocessTablePipes(content)

  // Configure plugins based on props
  const remarkPlugins: any[] = [remarkGfm]
  const rehypePlugins: any[] = [rehypeRaw]

  if (enableMath) {
    remarkPlugins.push(remarkMath)
    rehypePlugins.push(rehypeKatex)
  }

  const components = {
    // Enhanced code rendering with syntax highlighting
    code: ({ node, inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : 'text'

      if (!inline && match) {
        // 解码HTML实体，确保代码内容正确显示
        const rawContent = String(children).replace(/\n$/, '')
        const codeContent = decodeHtmlEntities(rawContent)
        const lineCount = codeContent.split('\n').length

        // 对于超过100行的代码，使用虚拟滚动
        if (lineCount > 100) {
          return (
            <VirtualizedCodeBlock language={language} showLineNumbers={showLineNumbers}>
              {codeContent}
            </VirtualizedCodeBlock>
          )
        }

        // 对于较小的代码块，使用原来的渲染方式
        return (
          <CodeBlock
            language={language}
            showLineNumbers={showLineNumbers}
          >
            {codeContent}
          </CodeBlock>
        )
      }

      // Inline code - 也需要解码HTML实体
      const inlineContent = decodeHtmlEntities(String(children))
      return (
        <code className={className} {...props}>
          {inlineContent}
        </code>
      )
    },

    // Enhanced table rendering
    table: ({ children, ...props }: any) => (
      <div className="table-container">
        <table {...props}>{children}</table>
      </div>
    ),

    // Enhanced blockquote rendering
    blockquote: ({ children, ...props }: any) => (
      <blockquote {...props}>
        {children}
      </blockquote>
    ),

    // Enhanced link rendering
    a: ({ children, href, ...props }: any) => (
      <a 
        href={href} 
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    ),

    // Enhanced image rendering
    img: ({ src, alt, ...props }: any) => (
      <img 
        src={src} 
        alt={alt}
        loading="lazy"
        style={{ maxWidth: '100%', height: 'auto' }}
        {...props}
      />
    ),

    // Enhanced heading rendering with anchor links
    h1: ({ children, ...props }: any) => (
      <h1 {...props}>{children}</h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 {...props}>{children}</h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 {...props}>{children}</h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 {...props}>{children}</h4>
    ),
    h5: ({ children, ...props }: any) => (
      <h5 {...props}>{children}</h5>
    ),
    h6: ({ children, ...props }: any) => (
      <h6 {...props}>{children}</h6>
    ),
  }

  return (
    <div
      className={`markdown-enhanced ${className}`}
      style={{ fontSize }}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

export default EnhancedMarkdown
