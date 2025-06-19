import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tress } from "@/types";
import {
  LockIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  CodeIcon,
  Globe,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getPublicTresses, getMyTresses } from "@/api/tress";
import { VisionSidebar } from "@/components/VisionSidebar";

export function Home() {
  const [publicTresses, setPublicTresses] = useState<Tress[]>([]);
  const [userTresses, setUserTresses] = useState<Tress[]>([]);
  const [activeTab, setActiveTab] = useState<"public" | "mine" | "trending">(
    "public"
  );
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const publicData = await getPublicTresses();
        setPublicTresses(publicData);

        if (isLoggedIn) {
          const userData = await getMyTresses();
          setUserTresses(userData);
        }
      } catch (error) {
        console.error("Error fetching tresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn]);

  const formatTimeAgo = () => {
    return "最近";
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

  const renderTressCard = (tress: Tress, index: number) => (
    <div
      key={tress.id}
      className="group card-modern hover:scale-[1.02] cursor-pointer p-6"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => navigate(`/tress/${tress.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {tress.owner_username[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {tress.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <UserIcon className="w-3 h-3" />
              <span>{tress.owner_username}</span>
              <span>•</span>
              <ClockIcon className="w-3 h-3" />
              <span>{formatTimeAgo()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!tress.is_public && (
            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <LockIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </div>
          )}
          <div
            className={`px-3 py-1 rounded-full ${getLanguageColor(
              tress.language
            )} text-white text-xs font-medium`}
          >
            {tress.language}
          </div>
        </div>
      </div>

      {/* Content preview */}
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
          {tress.content || "无内容预览"}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <CodeIcon className="w-3 h-3" />
            <span>{tress.content.length} 字符</span>
          </div>
          <div className="flex items-center space-x-1">
            {tress.is_public ? (
              <Globe className="w-3 h-3" />
            ) : (
              <LockIcon className="w-3 h-3" />
            )}
            <span>{tress.is_public ? "公开" : "私有"}</span>
          </div>
        </div>

        <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
          <EyeIcon className="w-3 h-3" />
          <span>查看</span>
        </button>
      </div>
    </div>
  );

  const getTabTitle = () => {
    switch (activeTab) {
      case "public":
        return "公开分享";
      case "mine":
        return "我的创作";
      case "trending":
        return "热门趋势";
      default:
        return "公开分享";
    }
  };

  const getCurrentTresses = () => {
    switch (activeTab) {
      case "public":
        return publicTresses;
      case "mine":
        return userTresses;
      case "trending":
        return []; // TODO: 实现热门趋势数据
      default:
        return publicTresses;
    }
  };

  const getEmptyStateContent = () => {
    switch (activeTab) {
      case "public":
        return {
          title: "暂无公开分享",
          description: "成为第一个分享代码的人吧！",
          action: isLoggedIn
            ? () => navigate("/create")
            : () => navigate("/register"),
          actionText: isLoggedIn ? "创建 Tress" : "开始创作",
        };
      case "mine":
        return {
          title: "还没有创作",
          description: "创建你的第一个 Tress，开始分享代码之旅",
          action: () => navigate("/create"),
          actionText: "开始创作",
        };
      case "trending":
        return {
          title: "暂无热门内容",
          description: "热门趋势功能即将上线",
          action: () => navigate("/create"),
          actionText: "创建 Tress",
        };
      default:
        return {
          title: "暂无内容",
          description: "",
          action: () => {},
          actionText: "",
        };
    }
  };

  return (
    <>
      {/* Vision Pro 风格侧栏 */}
      <VisionSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 主内容区域 */}
      <div className="ml-20 p-8 space-y-8">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {getTabTitle()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {activeTab === "public" && "发现社区中精彩的代码分享"}
              {activeTab === "mine" && "管理你的代码片段和创作"}
              {activeTab === "trending" && "探索当前最受欢迎的代码"}
            </p>
          </div>

          {/* 统计信息 */}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {getCurrentTresses().length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              个内容
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="min-h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin border-t-blue-600"></div>
              </div>
            </div>
          ) : (
            <>
              {getCurrentTresses().length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentTresses().map(renderTressCard)}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CodeIcon className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {getEmptyStateContent().title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    {getEmptyStateContent().description}
                  </p>
                  {getEmptyStateContent().actionText && (
                    <button
                      onClick={getEmptyStateContent().action}
                      className="btn-primary"
                    >
                      {getEmptyStateContent().actionText}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
