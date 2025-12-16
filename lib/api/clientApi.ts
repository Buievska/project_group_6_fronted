import { $api } from "./api";
import axios from "axios";
import { Tool } from "@/types/tool";

export type LoginRequset = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequset) => {
  const response = await $api.post("auth/login", data);
  return response;
};
interface Tools {
  data: {
    tools: Tool[];
  };
}

export const logoutRequest = async () => {
  // Відправляємо запит на сервер, щоб він очистив Cookie
  return $api.post("auth/logout");
};

export const getCurrentUser = async () => {
  const response = await $api.get("users/current");
  return response.data;
};

export const getTools = async () => {
  const res = await axios.get<Tools>(
    "https://project-group-6-backend.onrender.com/api/tools"
  );
  return res.data;
};
