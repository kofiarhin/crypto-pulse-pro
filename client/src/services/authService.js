import { authApiClient } from "../lib/apiClient";

export const authService = {
  register: async (payload) => {
    const response = await authApiClient.post("/register", payload);
    return response.data.data;
  },
  login: async (payload) => {
    const response = await authApiClient.post("/login", payload);
    return response.data.data;
  },
  refresh: async () => {
    const response = await authApiClient.post("/refresh");
    return response.data.data;
  },
  me: async (accessToken) => {
    const response = await authApiClient.get("/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  },
  logout: async () => {
    const response = await authApiClient.post("/logout");
    return response.data.data;
  },
};
