import { $api } from "./api";
import axios from "axios";
import { Tool } from "@/types/tool";
import { User, UserProfile } from "@/types/user";

export type UserRequest = {
  name: string;
  email: string;
  password: string;
};

export const register = async (userData: UserRequest) => {
  const { data } = await $api.post<User>("/auth/register", userData);
  return data;
};

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

type ToolsApiResponse = {
  data: {
    tools: Tool[];
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
};

export interface Category {
  _id: string;
  title: string;
  description: string;
  keywords: string;
}

type CategoriesResponsee = {
  status: string;
  data: Category[];
};

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

export async function fetchCategories(): Promise<Category[]> {
  const res = await axios.get<CategoriesResponsee>(
    "https://project-group-6-backend.onrender.com/api/categories"
  );

  return res.data.data;
}

export const getCategories = async () => {
  const { data } = await axios.get("/api/categories");
  return data;
};

export const createTool = async (formData: FormData) => {
  const { data } = await axios.post("/api/tools", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export async function fetchToolsPage(
  page: number,
  limit = 8,
  category = "all",
  search = ""
) {
  const res = await axios.get<ToolsApiResponse>(
    "https://project-group-6-backend.onrender.com/api/tools",
    {
      params: {
        page,
        limit,
        ...(category !== "all" && { category }),
        ...(search && { search }),
      },
    }
  );

  return res.data.data;
}

export const getToolById = async (id: string) => {
  const { data } = await $api.get<Tool>(`/tools/${id}`);
  return data;
};

export const getUserById = async (userId: string) => {
  const { data } = await $api.get<UserProfile>(`/users/${userId}`);
  return data;
};
