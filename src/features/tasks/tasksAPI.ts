import { privateAxios } from "../../app/axios";
import { API_URL_TASKS } from "../../app/config";

export type AddNewTaskData = {
  title: string;
  description: string;
  memberId: number;
};

export type UpdateTaskData = {
  title?: string;
  description?: string;
  memberId?: number;
};

// A mock function to mimic making an async request for data
export function fetchCount(amount = 1) {
  return new Promise<{ data: number }>((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}

export const fetchTasks = async () => {
  const response = await privateAxios({
    method: "GET",
    url: API_URL_TASKS,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const addNewTask = async (data: AddNewTaskData) => {
  const response = await privateAxios({
    method: "POST",
    url: API_URL_TASKS,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });

  return response.data;
};

export const updateTask = async (id: number, data: UpdateTaskData) => {
  const response = await privateAxios({
    method: "PATCH",
    url: `${API_URL_TASKS}${id}/`,
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });

  return response.data;
};

export const deleteTask = async (id: number) => {
  const response = await privateAxios({
    method: "DELETE",
    url: `${API_URL_TASKS}${id}/`,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
