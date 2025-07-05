import React, { useState, useCallback, useRef, useMemo } from 'react'
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

interface UnifiedCodeBlockProps {
  language: string
  children: string
  showLineNumbers?: boolean
  showCopyButton?: boolean
  showLanguageLabel?: boolean
  showContainer?: boolean // 是否显示独立的代码框容器
  fontSize?: string
  className?: string
  customStyle?: React.CSSProperties
}

export function UnifiedCodeBlock({
  language,
  children,
  showLineNumbers = true,
  showCopyButton = true,
  showLanguageLabel = true,
  showContainer = true,
  fontSize = '14px',
  className = '',
  customStyle = {}
}: UnifiedCodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { theme } = useTheme()
  const codeRef = useRef<HTMLDivElement>(null)

  // 根据主题选择代码高亮样式 - 使用 useMemo 优化性能
  const codeTheme = useMemo(() => theme === 'dark' ? customDarkTheme : customLightTheme, [theme])

  // 获取实际的主题模式（考虑system主题）
  const isDarkMode = useMemo(() => theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches), [theme])

  const handleCopy = useCallback(() => {
    // 只复制代码内容，不包含行号
    const decodedContent = decodeHtmlEntities(children)
    navigator.clipboard.writeText(decodedContent)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [children])

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
    ...customStyle
  } : {
    position: 'relative',
    margin: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    borderRadius: showContainer ? '16px' : '8px',
    background: 'transparent',
    border: 'none',
    boxShadow: 'none',
    ...customStyle
  }

  // 检测是否为移动端
  const isMobile = window.innerWidth <= 640

  const syntaxHighlighterStyle: React.CSSProperties = {
    margin: 0,
    background: showContainer ? 'transparent' : (isDarkMode ? '#1a1b26' : '#f8f9fa'),
    padding: showContainer ? (showLanguageLabel || showCopyButton ? '16px 20px' : '20px') : '16px',
    paddingTop: showContainer ? (showLanguageLabel || showCopyButton ? (isMobile ? '56px' : '50px') : '20px') : '16px',
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
    userSelect: 'none' as const, // 防止选中行号
    WebkitUserSelect: 'none' as const,
    MozUserSelect: 'none' as const,
    msUserSelect: 'none' as const
  }

  return (
    <div className={`unified-code-block ${className}`} style={containerStyle} ref={codeRef}>
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

      {/* 语言标签 - 只在显示容器时显示，并调整位置更靠近复制按钮 */}
      {showContainer && showLanguageLabel && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: showCopyButton ? '56px' : '16px', // 更靠近复制按钮
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

      {/* 复制按钮 - 只在显示容器时显示，并右移一点与圆角对齐 */}
      {showContainer && showCopyButton && (
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '8px',
            right: '12px', // 右移一点与圆角对齐
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

      {/* 代码内容 */}
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

export default UnifiedCodeBlock
