import { $api } from "./api";
import axios from "axios";
import { Tool } from "@/types/tool";
import { $api } from "./api";

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

export const fetchTools = async () => {
  const res = await axios.get<Tools>(
    "https://project-group-6-backend.onrender.com/api/tools"
  );
  return res.data.data.tools;
};

type ToolsApiResponse = {
  data: {
    tools: Tool[];
    page: number;
    pages: number;
    total: number;
    limit: number;
  };
};

export async function fetchToolsPage(page: number, limit = 8) {
  const res = await axios.get<ToolsApiResponse>(
    "http://localhost:4000/api/tools",
    {
      params: {
        page,
        limit,
        // sort: "-createdAt" // only if your backend supports it
      },
    }
  );

  return res.data.data; // { tools, page, pages, total, limit }
}
