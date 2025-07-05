import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Mail,
  Calendar,
  Edit3,
  Plus,
  BarChart3,
  Code,
  Eye,
} from "lucide-react";
import { getMe } from "@/api/auth";
import { UserProfile } from "@/types";
import { PageLoading } from "@/components/ui/loading";

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    getMe()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("获取用户信息时发生未知错误");
        }
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return <PageLoading message="加载用户信息中..." />;
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
                获取用户信息失败
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="px-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
          个人资料
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          管理你的账户信息和创作内容
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="flat-card p-8 text-center space-y-6">
            {/* Avatar */}
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                {profile.username[0].toUpperCase()}
              </div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border-2 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Edit3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* User Info */}
            <div className="space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {profile.username}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  用户 ID: {profile.id}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">加入时间</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => navigate("/create")}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>创建新的 Tress</span>
            </button>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flat-card p-6 text-center">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                0
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                创建的 Tress
              </p>
            </div>

            <div className="flat-card p-6 text-center">
              <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                0
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                总浏览量
              </p>
            </div>

            <div className="flat-card p-6 text-center">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                0
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">活跃度</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="flat-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                最近活动
              </h3>
              <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium transition-colors">
                查看全部
              </button>
            </div>

            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                还没有活动记录
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                创建你的第一个 Tress 来开始记录活动
              </p>
              <button
                onClick={() => navigate("/create")}
                className="btn-secondary"
              >
                开始创作
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/create")}
              className="flat-card p-6 text-left group hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    创建 Tress
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    分享新的代码片段
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate("/")}
              className="flat-card p-6 text-left group hover:scale-[1.02] transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center transition-colors">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    浏览 Tress
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    发现精彩的代码分享
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
