import { apiClient } from "../lib/apiClient";

export const userService = {
  getPreferences: async (accessToken) => {
    const response = await apiClient.get("/user/preferences", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data.preferences;
  },
  updatePreferences: async ({ accessToken, payload }) => {
    const response = await apiClient.patch("/user/preferences", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data.preferences;
  },
};
