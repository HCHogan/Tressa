import { useState } from "react";
import {
  ScrollTextIcon,
  UserIcon,
  PlusCircleIcon,
  TrendingUpIcon,
  Code,
  Eye,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface SidebarItem {
  id: "public" | "mine" | "trending" | "create" | "edit" | "preview";
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  requiresAuth?: boolean;
  action?: () => void;
}

interface VisionSidebarProps {
  // 主页模式
  activeTab?: "public" | "mine" | "trending";
  onTabChange?: (tab: "public" | "mine" | "trending") => void;

  // 编辑器模式
  mode?: "home" | "editor";
  editorActiveTab?: "edit" | "preview";
  onEditorTabChange?: (tab: "edit" | "preview") => void;

  // 新增：控制是否为嵌入式样式
  embedded?: boolean;
}

export function VisionSidebar({
  activeTab,
  onTabChange,
  mode = "home",
  editorActiveTab,
  onEditorTabChange,
  embedded = false,
}: VisionSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // 主页模式的侧边栏项目
  const homeSidebarItems: SidebarItem[] = [
    {
      id: "public",
      icon: ScrollTextIcon,
      label: "公开分享",
      color: "bg-primary hover:bg-primary-dark text-white",
    },
    {
      id: "mine",
      icon: UserIcon,
      label: "我的创作",
      color: "bg-secondary hover:bg-secondary-dark text-white",
      requiresAuth: true,
    },
    {
      id: "trending",
      icon: TrendingUpIcon,
      label: "热门趋势",
      color: "bg-accent hover:bg-accent-dark text-white",
    },
    {
      id: "create",
      icon: PlusCircleIcon,
      label: "创建新的",
      color: "bg-success hover:bg-success-dark text-white",
      requiresAuth: true,
      action: () => navigate("/create"),
    },
  ];

  // 编辑器模式的侧边栏项目
  const editorSidebarItems: SidebarItem[] = [
    {
      id: "edit",
      icon: Code,
      label: "编辑",
      color: "bg-primary hover:bg-primary-dark text-white",
    },
    {
      id: "preview",
      icon: Eye,
      label: "预览",
      color: "bg-info hover:bg-info-dark text-white",
    },
  ];

  const sidebarItems =
    mode === "editor" ? editorSidebarItems : homeSidebarItems;

  const handleItemClick = (item: SidebarItem) => {
    if (item.requiresAuth && !isLoggedIn) {
      navigate("/login");
      return;
    }

    if (mode === "editor" && onEditorTabChange) {
      if (item.id === "edit" || item.id === "preview") {
        onEditorTabChange(item.id);
      }
      return;
    }

    if (item.action) {
      item.action();
    } else if (item.id !== "create" && onTabChange) {
      onTabChange(item.id as "public" | "mine" | "trending");
    }
  };

  const getActiveState = (item: SidebarItem) => {
    if (mode === "editor") {
      return editorActiveTab === item.id;
    }
    return activeTab === item.id;
  };

  // 嵌入式样式（用于编辑器内部）
  if (embedded) {
    return (
      <div className="h-full flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="flex-1 flex flex-col gap-1 p-2">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = getActiveState(item);
            const isDisabled = item.requiresAuth && !isLoggedIn;

            return (
              <button
                key={item.id}
                onClick={() => !isDisabled && handleItemClick(item)}
                disabled={isDisabled}
                className={`
                  w-full flex flex-col items-center gap-1 py-3 px-2
                  rounded-2xl transition-all duration-200
                  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-slate-700"
                  }
                  ${isActive ? item.color : ""}
                `}
              >
                <IconComponent
                  className={`
                    w-5 h-5 transition-colors duration-200
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-700 dark:text-gray-300"
                    }
                  `}
                />
                <span
                  className={`
                    text-xs font-medium transition-colors duration-200 text-center
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  `}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 浮动样式（用于主页）
  return (
    <div
      className="group fixed left-6 top-1/2 -translate-y-1/2 z-40 will-change-transform"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      style={{
        transform: 'translate3d(0, -50%, 0)',
        backfaceVisibility: 'hidden',
      }}
    >
      <ul
        className={`
          relative flex flex-col gap-2 p-2
          bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl
          border border-gray-200/60 dark:border-slate-700/60
          shadow-lg shadow-black/5 dark:shadow-black/20
          transition-all duration-300 ease-out transform-gpu
          ${isExpanded ? "rounded-[20px] scale-105" : "rounded-[30px]"}
        `}
        style={{
          willChange: 'transform, border-radius',
          backfaceVisibility: 'hidden',
        }}
      >
        {sidebarItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = getActiveState(item);
          const isDisabled = item.requiresAuth && !isLoggedIn;

          return (
            <li key={item.id}>
              <a
                onClick={() => !isDisabled && handleItemClick(item)}
                className={`
                  cursor-pointer flex items-center overflow-hidden
                  transition-all duration-300 ease-out transform-gpu
                  ${isExpanded ? "w-48" : "w-10"} h-10
                  rounded-[30px]
                  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-slate-700"
                  }
                  ${isActive ? item.color : ""}
                `}
              >
                {/* Icon容器 */}
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <IconComponent
                    className={`
                      w-5 h-5 transition-colors duration-300
                      ${
                        isActive
                          ? "text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }
                    `}
                  />
                </div>

                {/* 文字标签 */}
                <span
                  className={`
                    flex-shrink-0 text-sm font-medium transition-all duration-300
                    ${
                      isActive
                        ? "text-white"
                        : "text-gray-900 dark:text-gray-100"
                    }
                    ${
                      isExpanded
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-2"
                    }
                  `}
                >
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
