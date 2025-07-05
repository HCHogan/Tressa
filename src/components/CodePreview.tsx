import { EnhancedMarkdown } from '@/components/EnhancedMarkdown'
import UnifiedCodeBlock from '@/components/UnifiedCodeBlock'

interface CodePreviewProps {
    content: string
    language: string
}

export function CodePreview({ content, language }: CodePreviewProps) {
    if (language === 'markdown') {
        return (
            <div className="max-w-none overflow-auto p-4">
                <EnhancedMarkdown
                    content={content}
                    className="prose-enhanced"
                />
            </div>
        )
    }

    return (
        <div className="p-4">
            <UnifiedCodeBlock
                language={language}
                showLineNumbers={true}
                showCopyButton={false}
                showLanguageLabel={false}
                showContainer={false}
                fontSize="14px"
                customStyle={{
                    margin: 0,
                    borderRadius: '0.375rem'
                }}
            >
                {content}
            </UnifiedCodeBlock>
        </div>
    )
}
