import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Code,
  Globe,
  Lock,
  FileCode,
  Save,
  Settings,
  ArrowLeft,
  Clock,
} from "lucide-react";
import { createTress } from "@/api/tress";
import { ButtonLoading } from "@/components/ui/loading";
import { languageOptions } from "@/lib/languageOptions";
import { TressEditor } from "@/components/TressEditor";
import { VisionSidebar } from "@/components/VisionSidebar";
import { useAuth } from "@/hooks/useAuth";

export function CreateTress() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [isPublic, setIsPublic] = useState(true);
  const [expiresInDays, setExpiresInDays] = useState<number | undefined>(undefined);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // 设置匿名用户的默认过期时间
  useEffect(() => {
    if (!isLoggedIn && expiresInDays === undefined) {
      setExpiresInDays(30); // 匿名用户默认30天
    }
  }, [isLoggedIn, expiresInDays]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("请输入标题");
      return;
    }
    if (!content.trim()) {
      setError("请输入内容");
      return;
    }

    // 验证匿名用户的过期时间限制
    if (!isLoggedIn && expiresInDays && expiresInDays > 365) {
      setError("匿名用户最多只能设置365天的过期时间");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const requestData: any = {
        title: title.trim(),
        content,
        language,
        is_public: isPublic,
      };

      if (expiresInDays) {
        requestData.expires_in_days = expiresInDays;
      }

      const data = await createTress(requestData, isLoggedIn);
      navigate(`/tress/${data.id}`);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("Anonymous users can only set expiration up to 365 days")) {
          setError("匿名用户最多只能设置365天的过期时间");
        } else if (err.message.includes("rate limit") || err.message.includes("速率限制")) {
          setError("请求过于频繁，请稍后再试");
        } else {
          setError(err.message);
        }
      } else {
        setError("创建 Tress 时发生未知错误");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                创建新的 Tress
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                分享你的代码片段
              </p>
            </div>
          </div>
        </div>

        {/* Anonymous User Info */}
        {!isLoggedIn && (
          <div className="flat-card border-blue-200 dark:border-blue-800 p-4 bg-blue-50 dark:bg-blue-900/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-200">
                  匿名创建
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  您正在以匿名用户身份创建内容。匿名创建的内容最多保存365天，默认30天后过期。
                  <a href="/login" className="underline ml-1">登录</a> 以创建永久内容。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="flat-card border-red-200 dark:border-red-800 p-4 bg-white dark:bg-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200">
                  创建失败
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Info */}
          <div className="flat-card p-6 bg-white dark:bg-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <FileCode className="w-4 h-4" />
                  <span>标题</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="给你的Tress起个好名字..."
                    className="input-modern w-full"
                    required
                  />
                </div>
              </div>

              {/* Language */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <Code className="w-4 h-4" />
                  <span>语言</span>
                </label>
                <div className="relative">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input-modern w-full appearance-none cursor-pointer"
                  >
                    {languageOptions.map((lang) => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="flat-card p-6 bg-white dark:bg-slate-800">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  发布设置
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  一些Tress相关的配置
                </p>
              </div>
            </div>

            <div className="settings-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Privacy Setting */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {isPublic ? (
                    <Globe className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-600" />
                  )}
                  <span>可见性</span>
                </label>
                <div className="settings-card-content p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 h-[80px] flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {isPublic ? "公开分享" : "私人收藏"}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 truncate">
                        {isPublic
                          ? "所有人都可以查看和搜索"
                          : "只有你可以查看"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPublic(!isPublic)}
                      className={`toggle-switch relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isPublic ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          isPublic ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expiration Setting */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>过期时间</span>
                </label>
                <div className="settings-card-content p-4 bg-gray-50 dark:bg-slate-700 rounded-xl border border-gray-200 dark:border-slate-600 h-[80px] flex flex-col justify-center">
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {!isLoggedIn
                        ? "匿名用户创建的内容最多保存365天"
                        : "设置内容的保存时间，不设置则永久保存"}
                    </div>
                    <select
                      value={expiresInDays || ""}
                      onChange={(e) => setExpiresInDays(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="input-modern w-full text-sm"
                    >
                      {isLoggedIn && <option value="">永不过期</option>}
                      <option value="1">1天</option>
                      <option value="7">7天</option>
                      <option value="30">30天</option>
                      <option value="90">90天</option>
                      <option value="180">180天</option>
                      <option value="365">365天</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editor with Embedded Sidebar */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                内容
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Settings className="w-4 h-4" />
                <span>编辑器设置</span>
              </div>
            </div>

            <div className="border border-gray-200/60 dark:border-slate-700/60 rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
              <div className="flex h-[600px]">
                {/* Embedded Sidebar */}
                <div className="w-20 flex-shrink-0">
                  <VisionSidebar
                    mode="editor"
                    editorActiveTab={activeTab}
                    onEditorTabChange={setActiveTab}
                    embedded={true}
                  />
                </div>

                {/* Editor Area */}
                <div className="flex-1 min-w-0">
                  <TressEditor
                    content={content}
                    language={language}
                    activeTab={activeTab}
                    setContent={setContent}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-ghost"
              disabled={isLoading}
            >
              取消
            </button>

            <ButtonLoading
              onClick={handleSubmit}
              loading={isLoading}
              className="min-w-[140px]"
            >
              <Save className="w-4 h-4" />
              <span>创建 Tress</span>
            </ButtonLoading>
          </div>
        </div>
      </div>
    </div>
  );
}
