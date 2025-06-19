import { apiClient } from "./apiClient";
import { Tress } from "@/types";

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
