import { $api } from "./api";
import axios from "axios";
import { Tool } from "@/types/tool";

export type LoginRequset = {
  email: string;
  password: string;
};

export const login = async (data: LoginRequset) => {
  const response = await $api.post("auth/login", data);
  return response.data;
};
interface Tools {
  data: {
    tools: Tool[];
  };
}

export const getTools = async () => {
  const res = await axios.get<Tools>(
    "https://project-group-6-backend.onrender.com/api/tools"
  );
  return res.data;
};
