import { userApiClient } from "../lib/apiClient";

export const userService = {
  getPreferences: async (accessToken) => {
    const response = await userApiClient.get("/preferences", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data.preferences;
  },
  updatePreferences: async ({ accessToken, payload }) => {
    const response = await userApiClient.patch("/preferences", payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data.preferences;
  },
};
