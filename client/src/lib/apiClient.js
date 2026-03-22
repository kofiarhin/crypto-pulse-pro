import axios from "axios";
import { API_AUTH_BASE, API_USER_BASE } from "./apiConfig";

const buildApiClient = (baseURL) =>
  axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

export const authApiClient = buildApiClient(API_AUTH_BASE);
export const userApiClient = buildApiClient(API_USER_BASE);

export const extractApiError = (error) => {
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  return error?.message || "Something went wrong.";
};
