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
  Hash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UnifiedCodeBlock from "@/components/UnifiedCodeBlock";
import VirtualizedCodeBlock from "@/components/VirtualizedCodeBlock";
import { Tress } from "@/types";
import { getTressById, deleteTressById, getTressRawUrl } from "@/api/tress";
import { useAuth } from "@/hooks/useAuth";

import { EnhancedMarkdown } from "@/components/EnhancedMarkdown";
import { ContentLoading } from "@/components/ui/loading";

// 解码HTML实体的工具函数
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}

// 时间格式化函数
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "刚刚";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`;
  return `${Math.floor(diffInSeconds / 31536000)}年前`;
}

function formatExpirationTime(expiresAt: string | null): string | null {
  if (!expiresAt) return null;

  const expireDate = new Date(expiresAt);
  const now = new Date();
  const diffInSeconds = Math.floor((expireDate.getTime() - now.getTime()) / 1000);

  if (diffInSeconds <= 0) return "已过期";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟后过期`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时后过期`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天后过期`;
  return `${Math.floor(diffInSeconds / 2592000)}个月后过期`;
}

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
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  // 检查用户删除权限的函数
  const checkUserCanDelete = useCallback((tressData: Tress): boolean => {
    if (!isLoggedIn || !tressData.owner_id) {
      return false;
    }
    const currentUserId = localStorage.getItem("userId");
    return !!(currentUserId && currentUserId === tressData.owner_id.toString());
  }, [isLoggedIn]);

  useEffect(() => {
    if (!id) return;
    const fetchTress = async () => {
      try {
        setLoading(true);
        const data = await getTressById(id);
        setTress(data);
        setWordCount(data.content.trim().split(/\s+/).length);
        // 使用函数检查删除权限
        setUserCanDelete(checkUserCanDelete(data));
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("expired") || err.message.includes("过期")) {
            setError("此内容已过期，无法访问");
          } else if (err.message.includes("Not Found") || err.message.includes("404")) {
            setError("内容不存在或已被删除");
          } else {
            setError(err.message);
          }
        } else {
          setError("获取 Tress 时发生未知错误");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTress();
  }, [id, checkUserCanDelete]);

  // 当登录状态或tress数据变化时，重新检查删除权限
  useEffect(() => {
    if (tress) {
      setUserCanDelete(checkUserCanDelete(tress));
    }
  }, [isLoggedIn, tress, checkUserCanDelete]);

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
      navigator.clipboard.writeText(decodeHtmlEntities(tress.content));
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
      haskell: "bg-purple-700",
      scala: "bg-red-700",
      nix: "bg-blue-700",
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
    <div className="viewtress-container space-y-4 md:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-start space-x-4">
          <button
            onClick={() => navigate("/")}
            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200 flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 break-words">
              {tress.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-xs">
                  {tress.owner_username ? tress.owner_username[0].toUpperCase() : "A"}
                </div>
                <span>{tress.owner_username || "Anonymous"}</span>
              </div>
              <span>•</span>
              <span>{formatTimeAgo(tress.created_at)}</span>
              {tress.expires_at && (
                <>
                  <span>•</span>
                  <span className="text-orange-600 dark:text-orange-400">
                    {formatExpirationTime(tress.expires_at)}
                  </span>
                </>
              )}
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

        <div className="flex items-center space-x-3 md:mt-0 mt-2">
          <div
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full ${getLanguageColor(
              tress.language
            )} text-white text-xs md:text-sm font-medium`}
          >
            {tress.language}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flat-card p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto">
            {/* Font Size Controls */}
            <div className="flex items-center space-x-1 md:space-x-2 bg-gray-100 dark:bg-slate-700 rounded-xl p-1.5 md:p-2 flex-shrink-0">
              <button
                onClick={() => handleFontSizeChange(Math.max(12, fontSize - 1))}
                className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white dark:bg-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors"
              >
                <ZoomOut className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px] md:min-w-[50px] text-center">
                {fontSize}px
              </span>
              <button
                onClick={() => handleFontSizeChange(Math.min(24, fontSize + 1))}
                className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white dark:bg-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors"
              >
                <ZoomIn className="w-3 h-3 md:w-4 md:h-4" />
              </button>
              <button
                onClick={() => handleFontSizeChange(16)}
                className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white dark:bg-slate-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-500 transition-colors"
              >
                <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            </div>

            {/* Line Numbers Toggle */}
            <button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-colors text-xs md:text-sm flex-shrink-0 ${
                showLineNumbers
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
              title={showLineNumbers ? "隐藏行号" : "显示行号"}
            >
              <Hash className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">代码行号</span>
              <span className="sm:hidden">行号</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={`flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-all duration-200 text-xs md:text-sm flex-shrink-0 ${
                isCopied
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-3 h-3 md:w-4 md:h-4" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 md:w-4 md:h-4" />
                  <span>复制</span>
                </>
              )}
            </button>

            {/* Raw Link Button */}
            <a
              href={getTressRawUrl(id!)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-xs md:text-sm flex-shrink-0"
            >
              <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
              <span>Raw</span>
            </a>

            {/* Delete Button */}
            {userCanDelete && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center space-x-1 md:space-x-2 px-3 md:px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs md:text-sm flex-shrink-0"
              >
                <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                <span>删除</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flat-card viewtress-content overflow-hidden min-w-0">
        {tress.language === "markdown" ? (
          <div
            className="max-w-none overflow-auto w-full"
            style={{ minWidth: '100%' }}
          >
            <EnhancedMarkdown
              content={tress.content}
              fontSize={`${fontSize}px`}
              className="prose-enhanced"
              showLineNumbers={showLineNumbers}
            />
          </div>
        ) : (
          <div className="w-full overflow-auto" style={{ minWidth: '100%' }}>
            {(() => {
              const lineCount = tress.content.split('\n').length;
              const shouldVirtualize = lineCount > 2000; // 简化的阈值

              if (shouldVirtualize) {
                return (
                  <VirtualizedCodeBlock
                    language={tress.language.toLowerCase()}
                    maxLines={2000}
                    showLineNumbers={showLineNumbers}
                    showCopyButton={false}
                    showLanguageLabel={false}
                    showContainer={false}
                    fontSize={`${fontSize}px`}
                  >
                    {tress.content}
                  </VirtualizedCodeBlock>
                );
              } else {
                return (
                  <UnifiedCodeBlock
                    language={tress.language.toLowerCase()}
                    fontSize={`${fontSize}px`}
                    showLineNumbers={showLineNumbers}
                    showCopyButton={false}
                    showLanguageLabel={false}
                    showContainer={false}
                    customStyle={{
                      margin: 0,
                      borderRadius: '8px'
                    }}
                  >
                    {tress.content}
                  </UnifiedCodeBlock>
                );
              }
            })()}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
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
