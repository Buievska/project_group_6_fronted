import { $api } from "./api";
import axios from "axios";
import { Tool } from "@/types/tool";

export type LoginRequset = {
  email: string;
  password: string;
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

interface CategoriesResponse {
  status: string;
  data: Category[];
}

export const login = async (data: LoginRequset) => {
  const response = await $api.post("auth/login", data);
  return response.data;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const res = await axios.get<CategoriesResponse>(
    "https://project-group-6-backend.onrender.com/api/categories"
  );
  return res.data.data;
};

export const getTools = async () => {
  const res = await axios.get<Tools>(
    "https://project-group-6-backend.onrender.com/api/tools"
  );
  return res.data;
};

export async function fetchToolsPage(page: number, limit = 8) {
  const res = await axios.get<ToolsApiResponse>(
    "https://project-group-6-backend.onrender.com/api/tools",
    {
      params: {
        page,
        limit,
      },
    }
  );

  return res.data.data;
}
