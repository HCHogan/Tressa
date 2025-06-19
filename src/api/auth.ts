import { apiClient } from "./apiClient";
import { LoginData, RegisterData } from "@/types";

export const login = (credentials: LoginData) => {
  const body = new URLSearchParams();
  body.append("username", credentials.username);
  body.append("password", credentials.password);
  return apiClient("/auth/token", {
    method: "POST",
    body,
    needsAuth: false,
  });
};

export const register = (userData: RegisterData) => {
  return apiClient("/auth/register", {
    method: "POST",
    body: userData,
    needsAuth: false,
  });
};

export const getMe = () => {
  return apiClient("/auth/me");
};
