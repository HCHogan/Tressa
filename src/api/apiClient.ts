import { API_URL } from "@/config";

type ApiClientOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  needsAuth?: boolean;
};

export const apiClient = async (
  endpoint: string,
  {
    method = "GET",
    body,
    needsAuth = true,
    headers = {},
  }: ApiClientOptions = {}
) => {
  const config: RequestInit = {
    method,
    headers: {
      ...headers,
    } as Record<string, string>,
  };

  if (body) {
    if (body instanceof URLSearchParams) {
      (config.headers as Record<string, string>)["Content-Type"] =
        "application/x-www-form-urlencoded";
      config.body = body;
    } else {
      (config.headers as Record<string, string>)["Content-Type"] =
        "application/json";
      config.body = JSON.stringify(body);
    }
  }

  if (needsAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}/api${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ detail: "An unknown error occurred" }));
    throw new Error(errorData.detail || "Request failed");
  }

  if (response.status === 204) {
    return;
  }

  return response.json();
};
