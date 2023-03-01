import axios from "axios";
import { API_BASE_URL } from "./config";
import { logoutAndResetStore } from "../features/auth/authSlice";
import { store } from "./store";
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
      store.dispatch(logoutAndResetStore());
      console.log("isInvalidToken", isInvalidToken);
    }

    return Promise.reject(error);
  }
);
