import { apiClient } from "./apiClient";
import { Tress } from "@/types";
import { API_URL } from "@/config";

type CreateTressData = Omit<Tress, "id" | "owner_id" | "owner_username">;

export const createTress = (data: CreateTressData) => {
  return apiClient("/tress/", { method: "POST", body: data });
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
