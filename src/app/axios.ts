import axios from "axios";
import { API_BASE_URL } from "./config";

export const publicAxios = axios.create({ baseURL: API_BASE_URL });
export const privateAxios = axios.create({ baseURL: API_BASE_URL });

privateAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const isInvalidToken: boolean = error?.response?.status === 401;

    if (isInvalidToken) {
      // Logout
      // refreshToken();
      console.error("isInvalidToken");
    }

    return Promise.reject(error);
  }
);
