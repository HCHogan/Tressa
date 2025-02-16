import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MonacoEditor } from '@/components/MonacoEditor'
import { CodePreview } from '@/components/CodePreview'
import { Code, Eye } from 'lucide-react'

interface TressEditorProps {
    content: string
    language: string
    activeTab: string
    setActiveTab: (tab: string) => void
    setContent: (content: string) => void
}

export function TressEditor({ content, language, activeTab, setActiveTab, setContent}: TressEditorProps) {
    return (
        <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="edit" className="flex items-center gap-2">
                        <Code className="h-4 w-4" />
                        Edit
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Preview
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="border rounded-md p-4 mt-2">
                    <MonacoEditor
                        language={language}
                        value={content}
                        onChange={setContent}
                        height="400px"
                    />
                </TabsContent>
                <TabsContent value="preview" className="border rounded-md p-4 mt-2">
                    <CodePreview content={content} language={language} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

