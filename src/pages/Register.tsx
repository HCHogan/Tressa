import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AlertCircle,
  User,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { register } from "@/api/auth";
import { ButtonLoading } from "@/components/ui/loading";
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/ToastContainer";

export function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toasts, removeToast, success, error: showError } = useToast();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError("密码和确认密码不匹配");
      return false;
    }
    if (password.length < 6) {
      setError("密码长度至少为6位");
      return false;
    }
    if (!email.includes("@")) {
      setError("请输入有效的邮箱地址");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setIsLoading(true);

    try {
      await register({ username, email, password });
      success("注册成功", "正在跳转到登录页面...");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        showError("注册失败", err.message);
      } else {
        setError("注册时发生未知错误");
        showError("注册失败", "注册时发生未知错误");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, text: "", color: "gray" };
    if (password.length < 6)
      return { strength: 1, text: "密码太短", color: "red" };
    if (password.length < 8)
      return { strength: 2, text: "密码强度较弱", color: "yellow" };
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return { strength: 4, text: "密码强度很强", color: "green" };
    }
    return { strength: 3, text: "密码强度中等", color: "blue" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              加入 Tressa
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              创建你的账户，开始分享代码之旅
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flat-card border-red-200 dark:border-red-800 p-4 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-200 text-sm">
                  注册失败
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Register Form */}
        <div className="flat-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                用户名
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="选择一个用户名"
                  className="input-modern w-full pl-12"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                邮箱地址
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="请输入邮箱地址"
                  className="input-modern w-full pl-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="创建一个安全密码"
                  className="input-modern w-full pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.color === "red"
                            ? "bg-red-500"
                            : passwordStrength.color === "yellow"
                            ? "bg-yellow-500"
                            : passwordStrength.color === "blue"
                            ? "bg-blue-500"
                            : passwordStrength.color === "green"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                        style={{
                          width: `${(passwordStrength.strength / 4) * 100}%`,
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.color === "red"
                          ? "text-red-600 dark:text-red-400"
                          : passwordStrength.color === "yellow"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : passwordStrength.color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : passwordStrength.color === "green"
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500"
                      }`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                确认密码
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  className="input-modern w-full pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <div className="absolute inset-y-0 right-12 flex items-center pr-2">
                    {password === confirmPassword ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Register Button */}
            <ButtonLoading
              type="submit"
              loading={isLoading}
              className="w-full h-12"
            >
              <span>创建账户</span>
              <ArrowRight className="w-4 h-4" />
            </ButtonLoading>
          </form>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              注册即表示您同意我们的{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                服务条款
              </a>{" "}
              和{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                隐私政策
              </a>
            </p>
          </div>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              已有账户？{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
              >
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <span>← 返回首页</span>
          </Link>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
