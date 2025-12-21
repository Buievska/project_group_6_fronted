import { $api } from "./api";
import { Tool } from "@/types/tool";
import { User, UserProfile } from "@/types/user";
import { CreateBookingRequest, CreateBookingResponse } from "@/types/booking";

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
  const { data: responseData } = await $api.post("/auth/login", data);
  return responseData;
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
  return $api.post("/auth/logout");
};

export const getCurrentUser = async () => {
  const response = await $api.get("/users/current");
  return response.data;
};

export const getTools = async () => {
  const res = await $api.get<Tools>("/tools");
  return res.data;
};

export async function fetchCategories(): Promise<Category[]> {
  const res = await $api.get<CategoriesResponsee>("/categories");
  return res.data.data;
}

export const getCategories = async () => {
  const { data } = await $api.get("/categories");
  return data;
};

export const createTool = async (formData: FormData) => {
  const { data } = await $api.post("/tools", formData, {
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
  const res = await $api.get<ToolsApiResponse>("/tools", {
    params: {
      page,
      limit,
      ...(category !== "all" && { category }),
      ...(search && { search }),
    },
  });

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

export const updateTool = async (id: string, formData: FormData) => {
  const { data } = await $api.patch<Tool>(`/tools/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const createBooking = async (
  data: CreateBookingRequest
): Promise<CreateBookingResponse> => {
  const response = await $api.post<CreateBookingResponse>("/bookings", data);
  return response.data;
};

export const updateUserProfile = async (
  userId: string,
  dataToSend: Partial<UserProfile>
) => {
  const { data } = await $api.patch<UserProfile>(
    `/users/${userId}`,
    dataToSend
  );
  return data;
};

export const getUserBookings = async () => {
  try {
    const response = await $api.get("/bookings/my");
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const deleteBooking = async (bookingId: string) => {
  const { data } = await $api.delete(`/bookings/${bookingId}`);
  return data;
};

export const getFeedbacksByToolId = async (toolId: string) => {
  const { data } = await $api.get(`/feedbacks/tool/${toolId}`);
  return data;
};
