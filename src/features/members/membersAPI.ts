import { privateAxios } from "../../app/axios";
import { API_URL_MEMBERS } from "../../app/config";

export type AddNewMemberData = {
  name: string;
};

export type UpdateMemberData = {
  name: string;
};

export const fetchMembers = async () => {
  const response = await privateAxios({
    method: "GET",
    url: API_URL_MEMBERS,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

export const addNewMember = async (data: AddNewMemberData) => {
  const response = await privateAxios({
    method: "POST",
    url: API_URL_MEMBERS,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });

  return response.data;
};

export const updateMember = async (id: number, data: UpdateMemberData) => {
  const response = await privateAxios({
    method: "PATCH",
    url: `${API_URL_MEMBERS}${id}/`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });

  return response.data;
};

export const deleteMember = async (id: number) => {
  const response = await privateAxios({
    method: "DELETE",
    url: `${API_URL_MEMBERS}${id}/`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
