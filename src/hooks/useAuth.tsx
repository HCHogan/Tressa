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
  updateUserInfo: (username: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then((data) => {
          updateUserInfo(data.username);
          localStorage.setItem("userId", data.id);
        })
        .catch(() => logout());
    }
  }, []);
  const updateUserInfo = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUsername("");
  };
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
