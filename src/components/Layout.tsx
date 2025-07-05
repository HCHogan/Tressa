import { ReactNode, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  MoonIcon,
  SunIcon,
  HomeIcon,
  PlusCircleIcon,
  UserIcon,
  MenuIcon,
  ScrollTextIcon,
  Bot,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { VERSION_CODE, APP_VERSION } from "@/config";
import { useAuth } from "@/hooks/useAuth";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 获取当前活跃的tab
  const currentTab = searchParams.get("tab") || "public";

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  // 创建带有菜单关闭功能的action函数
  const createMenuAction = (action: () => void) => {
    return () => {
      action();
      setIsMenuOpen(false);
    };
  };

  const mobileMenuItems = [
    {
      icon: ScrollTextIcon,
      label: "公开分享",
      path: "/",
      tab: "public",
      color: "bg-primary hover:bg-primary-dark text-white",
      action: createMenuAction(() => navigate("/?tab=public"))
    },
    {
      icon: UserIcon,
      label: "我的创作",
      path: "/",
      tab: "mine",
      color: "bg-secondary hover:bg-secondary-dark text-white",
      requiresAuth: true,
      action: createMenuAction(() => {
        if (isLoggedIn) {
          navigate("/?tab=mine");
        } else {
          navigate("/login");
        }
      })
    },
    {
      icon: Bot,
      label: "Sanuki回复",
      path: "/",
      tab: "sanuki",
      color: "bg-accent hover:bg-accent-dark text-white",
      action: createMenuAction(() => navigate("/?tab=sanuki"))
    },
    {
      icon: PlusCircleIcon,
      label: "创建新的",
      path: "/create",
      color: "bg-success hover:bg-success-dark text-white",
      requiresAuth: false, // 允许匿名用户创建
      action: createMenuAction(() => navigate("/create"))
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 nav-modern">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Tressa
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200">
                  <HomeIcon className="w-4 h-4" />
                  <span>首页</span>
                </button>
              </Link>
              <Link to="/create">
                <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200">
                  <PlusCircleIcon className="w-4 h-4" />
                  <span>创建</span>
                </button>
              </Link>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Theme toggle - hidden on mobile */}
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="hidden md:flex w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <SunIcon className="w-5 h-5 text-warning" />
                )}
              </button>

              {/* User menu - hidden on mobile */}
              <div className="relative group hidden md:block">
                <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 hover:bg-secondary-dark">
                  {username ? (
                    username[0].toUpperCase()
                  ) : (
                    <UserIcon className="w-5 h-5" />
                  )}
                </button>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {username}
                        </p>
                        <p className="text-xs text-success">已登录</p>
                      </div>
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        个人资料
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        退出登录
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        登录
                      </button>
                      <button
                        onClick={() => navigate("/register")}
                        className="w-full px-4 py-3 text-left text-sm text-primary hover:bg-primary/10 transition-colors"
                      >
                        注册
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button className="md:hidden w-11 h-11 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-200/60 dark:border-slate-700/60 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-sm hover:shadow-md mobile-menu-trigger">
                    <MenuIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-r border-gray-200/60 dark:border-slate-700/60 mobile-menu-content">
                  <SheetHeader className="px-6 py-5 border-b border-gray-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50">
                    <SheetTitle className="text-left text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Tressa
                    </SheetTitle>
                  </SheetHeader>
                  <div className="px-4 py-4 space-y-1">
                    {mobileMenuItems.map((item, index) => {
                      const isActive = item.tab === currentTab;
                      return (
                        <button
                          key={index}
                          onClick={item.action}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group min-h-[48px] mobile-menu-item ${
                            isActive
                              ? item.color
                              : "bg-transparent hover:bg-gray-100/80 dark:hover:bg-slate-800/80"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 mobile-menu-icon ${
                            isActive
                              ? ""
                              : "bg-gray-100 dark:bg-slate-700 group-hover:bg-gray-200 dark:group-hover:bg-slate-600"
                          }`}>
                            <item.icon className={`w-4 h-4 ${
                              isActive
                                ? "text-white"
                                : "text-gray-600 dark:text-gray-400"
                            }`} />
                          </div>
                          <span className={`font-medium ${
                            isActive
                              ? "text-white"
                              : "text-gray-900 dark:text-gray-100"
                          }`}>{item.label}</span>
                          {item.requiresAuth && !isLoggedIn && (
                            <span className={`ml-auto text-xs px-2 py-1 rounded-md ${
                              isActive
                                ? "text-white/70 bg-white/20"
                                : "text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700"
                            }`}>需要登录</span>
                          )}
                        </button>
                      );
                    })}

                    {/* Theme toggle */}
                    <div className="pt-3 mt-3 border-t border-gray-200/60 dark:border-slate-700/60">
                      <button
                        onClick={() => {
                          setTheme(theme === "light" ? "dark" : "light");
                          // 不关闭菜单，让用户可以继续操作
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left bg-transparent hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 group min-h-[48px] mobile-menu-item"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-slate-600 transition-colors duration-200 mobile-menu-icon">
                          {theme === "light" ? (
                            <MoonIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <SunIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {theme === "light" ? "深色模式" : "浅色模式"}
                        </span>
                      </button>
                    </div>

                    {/* User actions */}
                    {isLoggedIn ? (
                      <div className="pt-3 mt-3 border-t border-gray-200/60 dark:border-slate-700/60">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-gray-50/80 dark:bg-slate-800/50">
                          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {username ? username[0].toUpperCase() : "U"}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{username}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              已登录
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left bg-transparent hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-200 group min-h-[48px] mobile-menu-item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors duration-200 mobile-menu-icon">
                            <UserIcon className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <span className="font-medium text-red-600 dark:text-red-400">退出登录</span>
                        </button>
                      </div>
                    ) : (
                      <div className="pt-3 mt-3 border-t border-gray-200/60 dark:border-slate-700/60 space-y-1">
                        <button
                          onClick={createMenuAction(() => navigate("/login"))}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left bg-transparent hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 group min-h-[48px] mobile-menu-item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-slate-600 transition-colors duration-200 mobile-menu-icon">
                            <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">登录</span>
                        </button>
                        <button
                          onClick={createMenuAction(() => navigate("/register"))}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left bg-transparent hover:bg-gray-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 group min-h-[48px] mobile-menu-item"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-slate-600 transition-colors duration-200 mobile-menu-icon">
                            <PlusCircleIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-100">注册</span>
                        </button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>



      {/* Main content */}
      <main className="py-4 md:py-6 lg:py-8 flex-1 w-full">
        <div className="animate-fade-in w-full">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-gray-200 dark:border-slate-700 mt-auto">
        <div className="px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Tressa
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              版本 {APP_VERSION}({VERSION_CODE}) - Tressa 目前处于早期开发阶段
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
