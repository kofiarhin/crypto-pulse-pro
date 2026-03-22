import { apiClient } from "../lib/apiClient";

export const authService = {
  register: async (payload) => {
    const response = await apiClient.post("/auth/register", payload);
    return response.data.data;
  },
  login: async (payload) => {
    const response = await apiClient.post("/auth/login", payload);
    return response.data.data;
  },
  refresh: async () => {
    const response = await apiClient.post("/auth/refresh");
    return response.data.data;
  },
  me: async (accessToken) => {
    const response = await apiClient.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data.data;
  },
};
