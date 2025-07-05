import { apiClient } from "./apiClient";
import { CreateTressData, PageResponse, TreePreview } from "@/types";
import { API_URL } from "@/config";

export const createTress = (data: CreateTressData, needsAuth: boolean = true) => {
  return apiClient("/tress/", { method: "POST", body: data, needsAuth });
};

export const getPublicTresses = () => {
  return apiClient("/tress/", { needsAuth: false });
};

export const getMyTresses = () => {
  return apiClient("/tress/my");
};

export const getTressById = (id: string) => {
  return apiClient(`/tress/${id}`);
};

export const deleteTressById = (id: string) => {
  return apiClient(`/tress/${id}`, { method: "DELETE" });
};

export const getTressRawContent = async (id: string): Promise<string> => {
  const response = await fetch(`${API_URL}/api/tress/${id}/raw`, {
    method: "GET",
    headers: {
      "Accept": "text/plain",
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ detail: "An unknown error occurred" }));
    throw new Error(errorData.detail || "Request failed");
  }

  return response.text();
};

export const getTressRawUrl = (id: string): string => {
  return `${API_URL}/api/tress/${id}/raw`;
};

export const getPublicTressesPages = (page: number = 1, pageSize: number = 20): Promise<PageResponse<TreePreview>> => {
  return apiClient(`/tress/public/pages?page=${page}&page_size=${pageSize}`, { needsAuth: false });
};

export const getMyTressesPages = (page: number = 1, pageSize: number = 20): Promise<PageResponse<TreePreview>> => {
  return apiClient(`/tress/my/pages?page=${page}&page_size=${pageSize}`);
};
