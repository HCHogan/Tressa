import { MonacoEditor } from "@/components/MonacoEditor";
import { CodePreview } from "@/components/CodePreview";

interface TressEditorProps {
  content: string;
  language: string;
  activeTab: string;
  setContent: (content: string) => void;
}

export function TressEditor({
  content,
  language,
  activeTab,
  setContent,
}: TressEditorProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "edit" ? (
          <div className="h-full">
            <MonacoEditor
              language={language}
              value={content}
              onChange={setContent}
              height="100%"
            />
          </div>
        ) : (
          <div className="h-full p-4 overflow-auto bg-white dark:bg-slate-800">
            <CodePreview content={content} language={language} />
          </div>
        )}
      </div>
    </div>
  );
}
