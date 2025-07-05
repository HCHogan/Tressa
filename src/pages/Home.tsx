import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TreePreview } from "@/types";
import {
  LockIcon,
  EyeIcon,
  ClockIcon,
  UserIcon,
  CodeIcon,
  Globe,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePaginatedTresses } from "@/hooks/usePaginatedTresses";
import { VisionSidebar } from "@/components/VisionSidebar";
import { Pagination } from "@/components/Pagination";
import { CardSkeleton } from "@/components/ui/loading";

export function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"public" | "mine" | "sanuki">(
    (searchParams.get("tab") as "public" | "mine" | "sanuki") || "public"
  );
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // 使用分页Hook管理公开数据
  const {
    tresses: publicTresses,
    pagination: publicPagination,
    loading: publicLoading,
    error: publicError,
    loadPage: loadPublicPage,
  } = usePaginatedTresses({
    endpoint: "public",
    pageSize: 12, // 每页显示12个，适合3列布局
    autoLoad: true,
  });

  // 使用分页Hook管理用户数据
  const {
    tresses: userTresses,
    pagination: userPagination,
    loading: userLoading,
    error: userError,
    loadPage: loadUserPage,
    refresh: refreshUserTresses,
  } = usePaginatedTresses({
    endpoint: "my",
    pageSize: 12,
    autoLoad: isLoggedIn, // 只有登录时才自动加载
  });

  // 处理 tab 切换，同时更新 URL 参数
  const handleTabChange = (tab: "public" | "mine" | "sanuki") => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // 监听URL参数变化，同步activeTab状态
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab") as "public" | "mine" | "sanuki";
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams, activeTab]);

  // 监听登录状态变化，当用户登录后刷新用户数据
  useEffect(() => {
    if (isLoggedIn) {
      refreshUserTresses();
    }
  }, [isLoggedIn, refreshUserTresses]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "刚刚";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`;
    return `${Math.floor(diffInSeconds / 31536000)}年前`;
  };

  const formatExpirationTime = (expiresAt: string | null) => {
    if (!expiresAt) return null;

    const expireDate = new Date(expiresAt);
    const now = new Date();
    const diffInSeconds = Math.floor((expireDate.getTime() - now.getTime()) / 1000);

    if (diffInSeconds <= 0) return "已过期";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟后过期`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时后过期`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天后过期`;
    return `${Math.floor(diffInSeconds / 2592000)}个月后过期`;
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

  const renderTressCard = (tress: TreePreview, index: number) => (
    <div
      key={tress.id}
      className="group card-modern hover:scale-[1.02] cursor-pointer p-6 flex flex-col h-full"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => navigate(`/tress/${tress.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {tress.owner_username ? tress.owner_username[0].toUpperCase() : "A"}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
              {tress.title}
            </h3>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 min-w-0">
                <UserIcon className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{tress.owner_username || "Anonymous"}</span>
                <span className="flex-shrink-0">•</span>
                <ClockIcon className="w-3 h-3 flex-shrink-0" />
                <span className="whitespace-nowrap flex-shrink-0">{formatTimeAgo(tress.created_at)}</span>
              </div>
              {tress.expires_at && (
                <div className="flex items-center space-x-1 text-xs text-orange-600 dark:text-orange-400">
                  <ClockIcon className="w-3 h-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">{formatExpirationTime(tress.expires_at)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-shrink-0">
          {!tress.is_public && (
            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
              <LockIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </div>
          )}
          <div
            className={`language-tag px-2 py-1 rounded-full ${getLanguageColor(
              tress.language
            )} text-white text-xs font-medium max-w-[80px] sm:max-w-[100px] truncate flex-shrink-0`}
            title={tress.language}
          >
            {tress.language}
          </div>
        </div>
      </div>

      {/* Content preview - 使用 flex-1 让它占据剩余空间 */}
      <div className="flex-1 mb-4">
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
          {tress.content_preview || "无内容预览"}
        </p>
      </div>

      {/* Footer - 始终在底部 */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <CodeIcon className="w-3 h-3" />
            <span>{tress.content_preview.length}+ 字符</span>
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
      case "sanuki":
        return "Sanuki回复";
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
      case "sanuki":
        return []; // TODO: 实现Sanuki回复数据
      default:
        return publicTresses;
    }
  };

  const getCurrentPagination = () => {
    switch (activeTab) {
      case "public":
        return publicPagination;
      case "mine":
        return userPagination;
      case "sanuki":
        return null; // TODO: 实现Sanuki回复分页
      default:
        return publicPagination;
    }
  };

  const getCurrentLoading = () => {
    switch (activeTab) {
      case "public":
        return publicLoading;
      case "mine":
        return userLoading;
      case "sanuki":
        return false; // TODO: 实现Sanuki回复加载状态
      default:
        return publicLoading;
    }
  };

  const getCurrentError = () => {
    switch (activeTab) {
      case "public":
        return publicError;
      case "mine":
        return userError;
      case "sanuki":
        return null; // TODO: 实现Sanuki回复错误状态
      default:
        return publicError;
    }
  };

  const handlePageChange = (page: number) => {
    switch (activeTab) {
      case "public":
        loadPublicPage(page);
        break;
      case "mine":
        loadUserPage(page);
        break;
      case "sanuki":
        // TODO: 实现Sanuki回复分页
        break;
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
      case "sanuki":
        return {
          title: "暂无Sanuki回复",
          description: "Sanuki回复功能开发中",
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
      <VisionSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 主内容区域 */}
      <div className="md:ml-20 lg:ml-24 xl:ml-28 mx-4 md:mx-8 lg:mx-12 xl:mx-16 p-2 md:p-4 lg:p-6 space-y-4 md:space-y-6 lg:space-y-8 max-w-7xl">
        {/* 页面标题 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
              {getTabTitle()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm md:text-base">
              {activeTab === "public" && "公开Tress一览"}
              {activeTab === "mine" && "管理你的Tress"}
              {activeTab === "sanuki" && "查看Sanuki给你的回复"}
            </p>
          </div>

          {/* 统计信息 */}
          <div className="text-left md:text-right flex-shrink-0">
            <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {getCurrentPagination()?.total_items || getCurrentTresses().length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              个内容
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="min-h-[500px] space-y-6">
          {/* 错误提示 */}
          {getCurrentError() && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {getCurrentError()}
              </p>
            </div>
          )}

          {getCurrentLoading() ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <>
              {getCurrentTresses().length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getCurrentTresses().map(renderTressCard)}
                  </div>

                  {/* 分页组件 */}
                  {getCurrentPagination() && (
                    <div className="mt-8">
                      <Pagination
                        pagination={getCurrentPagination()!}
                        onPageChange={handlePageChange}
                        className="justify-center"
                      />
                    </div>
                  )}
                </>
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
