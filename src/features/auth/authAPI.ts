import { publicAxios } from "../../app/axios";
import { API_URL_AUTH_LOGIN, API_URL_AUTH_REGISTER } from "../../app/config";

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  name: string;
  password: string;
  password2: string;
};

export const login = async (data: LoginData) => {
  const response = await publicAxios({
    method: "POST",
    url: API_URL_AUTH_LOGIN,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });

  return response.data;
};

export const register = async (data: RegisterData) => {
  const response = await publicAxios({
    method: "POST",
    url: API_URL_AUTH_REGISTER,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });

  return response.data;
};
