import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MoonIcon,
  SunIcon,
  HomeIcon,
  PlusCircleIcon,
  UserIcon,
  MenuIcon,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { VERSION_CODE, APP_VERSION } from "@/config";
import { useAuth } from "@/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, setTheme } = useTheme();
  const { isLoggedIn, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 nav-modern">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
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
              {isLoggedIn && (
                <Link to="/create">
                  <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200">
                    <PlusCircleIcon className="w-4 h-4" />
                    <span>创建</span>
                  </button>
                </Link>
              )}
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-3">
              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200"
              >
                {theme === "light" ? (
                  <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <SunIcon className="w-5 h-5 text-warning" />
                )}
              </button>

              {/* User menu */}
              <div className="relative group">
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

              {/* Mobile menu button */}
              <button className="md:hidden w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200">
                <MenuIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="animate-fade-in">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-t border-gray-200 dark:border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
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
