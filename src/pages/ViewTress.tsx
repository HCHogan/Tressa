import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Copy,
  ArrowUp,
  ChevronLeft,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Globe,
  Lock,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Prism, Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  tomorrow,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Tress } from "@/types";
import { getTressById, deleteTressById, getTressRawUrl } from "@/api/tress";
import { useTheme } from "@/components/theme-provider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ContentLoading } from "@/components/ui/loading";

export function ViewTress() {
  const [tress, setTress] = useState<Tress | null>(null);
  const [error, setError] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [wordCount, setWordCount] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [userCanDelete, setUserCanDelete] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();

  useEffect(() => {
    if (!id) return;
    const fetchTress = async () => {
      try {
        setLoading(true);
        const data = await getTressById(id);
        setTress(data);
        setWordCount(data.content.trim().split(/\s+/).length);
        const currentUserId = localStorage.getItem("userId");
        setUserCanDelete(currentUserId === data.owner_id.toString());
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("获取 Tress 时发生未知错误");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTress();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteTressById(id);
      navigate("/");
      toast({
        title: "删除成功",
        description: "Tress 已成功删除。",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("删除 Tress 时发生未知错误");
      }
    }
  };

  const handleCopy = useCallback(() => {
    if (tress) {
      navigator.clipboard.writeText(tress.content);
      setIsCopied(true);
      toast({
        title: "复制成功",
        description: "代码已复制到剪贴板",
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [tress, toast]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: "bg-yellow-500",
      typescript: "bg-blue-500",
      python: "bg-green-500",
      java: "bg-red-500",
      go: "bg-cyan-500",
      rust: "bg-orange-500",
      markdown: "bg-gray-500",
      html: "bg-orange-500",
      css: "bg-blue-500",
      json: "bg-green-500",
    };
    return colors[language.toLowerCase()] || "bg-gray-500";
  };

  if (loading) {
    return <ContentLoading />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flat-card border-red-200 dark:border-red-800 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-200">
                加载失败
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tress) return null;

  return (
    <div className="px-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {tress.title}
            </h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                  {tress.owner_username[0].toUpperCase()}
                </div>
                <span>{tress.owner_username}</span>
              </div>
              <span>•</span>
              <span>{wordCount} 字符</span>
              <span>•</span>
              <div className="flex items-center space-x-1">
                {tress.is_public ? (
                  <Globe className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                <span>{tress.is_public ? "公开" : "私有"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div
            className={`px-4 py-2 rounded-full ${getLanguageColor(
              tress.language
            )} text-white text-sm font-medium`}
          >
            {tress.language}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flat-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Font Size Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-slate-700 rounded-xl p-2">
              <button
                onClick={() => handleFontSizeChange(Math.max(12, fontSize - 1))}
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[50px] text-center">
                {fontSize}px
              </span>
              <button
                onClick={() => handleFontSizeChange(Math.min(24, fontSize + 1))}
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleFontSizeChange(16)}
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isCopied
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>复制</span>
                </>
              )}
            </button>

            {/* Raw Link Button */}
            <a
              href={getTressRawUrl(id!)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Raw</span>
            </a>

            {/* Delete Button */}
            {userCanDelete && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>删除</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flat-card p-6 overflow-hidden min-w-0">
        {tress.language === "markdown" ? (
          <div
            className={`prose ${
              theme === "dark" ? "prose-invert" : ""
            } max-w-none overflow-auto min-w-full`}
            style={{ fontSize, minWidth: '600px' }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // @ts-ignore
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <Prism
                      // @ts-ignore
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </Prism>
                  ) : (
                    <code
                      className="rounded-lg bg-gray-100 dark:bg-gray-800 px-2 py-1 font-mono text-sm"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {tress.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div style={{ minWidth: '600px' }}>
            <SyntaxHighlighter
              language={tress.language.toLowerCase()}
              style={theme === "dark" ? tomorrow : oneLight}
              customStyle={{
                fontSize: `${fontSize}px`,
                background: "transparent",
                padding: 0,
                margin: 0,
                minWidth: '100%',
              }}
              className="rounded-xl"
            >
              {tress.content}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flat-card p-6 max-w-md mx-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  确认删除
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  此操作无法撤销。这将永久删除你的 Tress。
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowDeleteDialog(false)}
                  className="btn-ghost flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-xl transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={handleBackToTop}
          className="fixed bottom-24 right-8 w-12 h-12 bg-white dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-110 shadow-lg z-50"
        >
          <ArrowUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
      )}
    </div>
  );
}
