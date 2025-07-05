import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getMe } from "@/api/auth";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string;
  logout: () => void;
  updateUserInfo: (username: string, userId?: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const updateUserInfo = (username: string, userId?: string) => {
    setIsLoggedIn(true);
    setUsername(username);
    if (userId) {
      localStorage.setItem("userId", userId);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUsername("");
  };

  // 只在初始化时检查一次认证状态，避免重复请求
  useEffect(() => {
    if (isInitialized) return; // 如果已经初始化过，直接返回

    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then((data) => {
          updateUserInfo(data.username, data.id.toString());
        })
        .catch(() => logout())
        .finally(() => setIsInitialized(true));
    } else {
      setIsInitialized(true);
    }
  }, []); // 移除 isInitialized 依赖，只在组件挂载时执行一次
  return (
    <AuthContext.Provider
      value={{ isLoggedIn, username, logout, updateUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  // console.log(context?.isLoggedIn);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
