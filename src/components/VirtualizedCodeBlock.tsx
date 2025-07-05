import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Copy, Check } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { customLightTheme, customDarkTheme } from '@/lib/codeThemes'

// 解码HTML实体的工具函数
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

interface VirtualizedCodeBlockProps {
  language: string
  children: string
  maxLines?: number // 超过这个行数就启用虚拟滚动
  showLineNumbers?: boolean
  showCopyButton?: boolean
  showLanguageLabel?: boolean
  showContainer?: boolean // 是否显示独立的代码框容器
  fontSize?: string
}

interface VirtualizedCodeProps {
  lines: string[]
  language: string
  startIndex: number
  endIndex: number
  showLineNumbers?: boolean
  fontSize?: string
  showContainer?: boolean
}

function VirtualizedCode({ lines, language, startIndex, endIndex, showLineNumbers = true, fontSize = '14px', showContainer = true }: VirtualizedCodeProps) {
  const { theme } = useTheme()
  const visibleLines = lines.slice(startIndex, endIndex + 1)
  const codeContent = decodeHtmlEntities(visibleLines.join('\n'))

  // 根据主题选择代码高亮样式
  const codeTheme = theme === 'dark' ? customDarkTheme : customLightTheme

  // 获取实际的主题模式（考虑system主题）
  const isDarkMode = theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <SyntaxHighlighter
      style={codeTheme as any}
      language={language}
      PreTag="pre"
      showLineNumbers={showLineNumbers}
      startingLineNumber={startIndex + 1}
      customStyle={{
        margin: 0,
        background: 'transparent',
        padding: showContainer ? '16px 20px' : '16px',
        paddingTop: showContainer ? '40px' : '16px',
        fontSize,
        lineHeight: '1.7',
        borderRadius: 0,
        border: 'none',
      }}
      lineNumberStyle={{
        minWidth: '3em',
        paddingRight: '1em',
        color: isDarkMode ? '#6b7280' : '#9ca3af',
        borderRight: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
        marginRight: '1em',
        textAlign: 'right',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {codeContent}
    </SyntaxHighlighter>
  )
}

export function VirtualizedCodeBlock({
  language,
  children,
  maxLines = 100,
  showLineNumbers = true,
  showCopyButton = true,
  showLanguageLabel = true,
  showContainer = true,
  fontSize = '14px'
}: VirtualizedCodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { theme } = useTheme()
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(400)
  const containerRef = useRef<HTMLDivElement>(null)

  // 根据主题选择代码高亮样式
  const codeTheme = theme === 'dark' ? customDarkTheme : customLightTheme

  // 获取实际的主题模式（考虑system主题）
  const isDarkMode = theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  
  const lines = useMemo(() => children.split('\n'), [children])
  const totalLines = lines.length
  const shouldVirtualize = totalLines > maxLines

  // 虚拟滚动参数
  const lineHeight = 24 // 每行的高度（像素）
  const visibleLines = Math.ceil(containerHeight / lineHeight)
  const bufferLines = Math.floor(visibleLines * 0.5) // 缓冲区行数
  
  const startIndex = shouldVirtualize 
    ? Math.max(0, Math.floor(scrollTop / lineHeight) - bufferLines)
    : 0
  const endIndex = shouldVirtualize 
    ? Math.min(totalLines - 1, startIndex + visibleLines + bufferLines * 2)
    : totalLines - 1

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(children)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [children])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (shouldVirtualize) {
      setScrollTop(e.currentTarget.scrollTop)
    }
  }, [shouldVirtualize])

  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerHeight(Math.min(600, Math.max(300, rect.height)))
      }
    }

    updateContainerHeight()
    window.addEventListener('resize', updateContainerHeight)
    return () => window.removeEventListener('resize', updateContainerHeight)
  }, [])

  // 计算容器样式
  const containerStyle: React.CSSProperties = showContainer ? {
    position: 'relative',
    margin: '1.5rem 0',
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: '16px',
    background: isDarkMode ? '#1a1b26' : '#f8f9fa',
    border: `1px solid ${isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.6)'}`,
    boxShadow: isDarkMode
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  } : {
    position: 'relative',
    margin: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: '8px',
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
  }

  const syntaxHighlighterStyle: React.CSSProperties = {
    margin: 0,
    background: showContainer ? 'transparent' : (isDarkMode ? '#1a1b26' : '#f8f9fa'),
    padding: showContainer ? (showLanguageLabel || showCopyButton ? '16px 20px' : '20px') : '16px',
    paddingTop: showContainer ? (showLanguageLabel || showCopyButton ? '50px' : '20px') : '16px',
    fontSize,
    lineHeight: '1.7',
    borderRadius: showContainer ? 0 : '8px',
    border: showContainer ? 'none' : `1px solid ${isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.6)'}`,
    minWidth: '100%',
    overflow: 'auto'
  }

  const lineNumberStyle: React.CSSProperties = {
    minWidth: '3em',
    paddingRight: '1em',
    color: isDarkMode ? '#6b7280' : '#9ca3af',
    borderRight: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
    marginRight: '1em',
    textAlign: 'right' as const,
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    MozUserSelect: 'none' as const,
    msUserSelect: 'none' as const
  }

  if (!shouldVirtualize) {
    // 对于小文件，使用与 UnifiedCodeBlock 一致的渲染方式
    return (
      <div className="unified-code-block" style={containerStyle}>
        {/* macOS风格的窗口控制点 - 只在显示容器时显示 */}
        {showContainer && (
          <div
            style={{
              position: 'absolute',
              top: '15px',
              left: '16px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#ff5f56',
              boxShadow: '20px 0 0 #ffbd2e, 40px 0 0 #27ca40',
              zIndex: 10
            }}
          />
        )}

        {/* 语言标签 - 只在显示容器时显示 */}
        {showContainer && showLanguageLabel && (
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: showCopyButton ? '56px' : '16px',
              padding: '6px 14px',
              fontSize: '11px',
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              background: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(249, 250, 251, 0.9)',
              borderRadius: '8px',
              fontWeight: 600,
              backdropFilter: 'blur(8px)',
              zIndex: 10,
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.5px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              lineHeight: 1
            }}
          >
            {language}
          </div>
        )}

        {/* 复制按钮 - 只在显示容器时显示 */}
        {showContainer && showCopyButton && (
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '8px',
              right: '12px',
              zIndex: 10,
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              background: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(249, 250, 251, 0.9)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDarkMode ? 'rgba(55, 65, 81, 0.9)' : 'rgba(229, 231, 235, 0.9)'
              e.currentTarget.style.color = isDarkMode ? '#ffffff' : '#000000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(249, 250, 251, 0.9)'
              e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280'
            }}
            title={isCopied ? "已复制!" : "复制代码"}
          >
            {isCopied ? (
              <Check size={16} style={{ color: '#22c55e' }} />
            ) : (
              <Copy size={16} />
            )}
          </button>
        )}

        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={codeTheme as any}
          PreTag="pre"
          showLineNumbers={showLineNumbers}
          lineNumberStyle={lineNumberStyle}
          customStyle={syntaxHighlighterStyle}
          wrapLines={true}
          wrapLongLines={false}
        >
          {decodeHtmlEntities(children)}
        </SyntaxHighlighter>
      </div>
    )
  }

  // 当不显示容器时（如在ViewTress中），禁用虚拟滚动，直接渲染所有内容
  if (!showContainer) {
    return (
      <div className="unified-code-block" style={containerStyle}>
        <SyntaxHighlighter
          language={language.toLowerCase()}
          style={codeTheme as any}
          PreTag="pre"
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{
            minWidth: '3em',
            paddingRight: '1em',
            color: isDarkMode ? '#6b7280' : '#9ca3af',
            borderRight: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
            marginRight: '1em',
            textAlign: 'right' as const,
            userSelect: 'none' as const,
            WebkitUserSelect: 'none' as const,
            MozUserSelect: 'none' as const,
            msUserSelect: 'none' as const
          }}
          customStyle={syntaxHighlighterStyle}
          wrapLines={true}
          wrapLongLines={false}
        >
          {decodeHtmlEntities(children)}
        </SyntaxHighlighter>
      </div>
    )
  }

  // 虚拟滚动渲染（仅在显示容器时使用）
  const totalHeight = totalLines * lineHeight
  const offsetY = startIndex * lineHeight

  return (
    <div className="unified-code-block" style={containerStyle}>
      {/* macOS风格的窗口控制点 - 只在显示容器时显示 */}
      {showContainer && (
        <div
          style={{
            position: 'absolute',
            top: '15px',
            left: '16px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#ff5f56',
            boxShadow: '20px 0 0 #ffbd2e, 40px 0 0 #27ca40',
            zIndex: 10
          }}
        />
      )}

      {/* 语言标签 - 只在显示容器时显示，虚拟化时显示行数 */}
      {showContainer && showLanguageLabel && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: showCopyButton ? '56px' : '16px',
            padding: '6px 14px',
            fontSize: '11px',
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            background: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(249, 250, 251, 0.9)',
            borderRadius: '8px',
            fontWeight: 600,
            backdropFilter: 'blur(8px)',
            zIndex: 10,
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.5px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            lineHeight: 1
          }}
        >
          {language} ({totalLines} lines)
        </div>
      )}

      {/* 复制按钮 - 只在显示容器时显示 */}
      {showContainer && showCopyButton && (
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '8px',
            right: '12px',
            zIndex: 10,
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            background: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(249, 250, 251, 0.9)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            color: isDarkMode ? '#9ca3af' : '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(8px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDarkMode ? 'rgba(55, 65, 81, 0.9)' : 'rgba(229, 231, 235, 0.9)'
            e.currentTarget.style.color = isDarkMode ? '#ffffff' : '#000000'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(249, 250, 251, 0.9)'
            e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#6b7280'
          }}
          title={isCopied ? "已复制!" : "复制代码"}
        >
          {isCopied ? (
            <Check size={16} style={{ color: '#22c55e' }} />
          ) : (
            <Copy size={16} />
          )}
        </button>
      )}

      <div
        ref={containerRef}
        style={{
          height: `${containerHeight}px`,
          overflowY: 'auto',
          position: 'relative',
          background: showContainer ? 'transparent' : (isDarkMode ? '#1a1b26' : '#f8f9fa'),
          borderRadius: showContainer ? '0 0 16px 16px' : '8px',
          border: showContainer ? 'none' : `1px solid ${isDarkMode ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.6)'}`,
        }}
        onScroll={handleScroll}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <VirtualizedCode
              lines={lines}
              language={language}
              startIndex={startIndex}
              endIndex={endIndex}
              showLineNumbers={showLineNumbers}
              fontSize={fontSize}
              showContainer={showContainer}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VirtualizedCodeBlock
